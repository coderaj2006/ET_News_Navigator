const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./src/middleware/auth');

// Import the specific agents
const getEtNewsForLLM = require('./src/utils/fetchNews');
const SynthesisAgent = require('./synthesisAgent');
const InteractiveAgent = require('./interactiveAgent');
const newsWorker = require('./src/workers/newsWorker');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Authentication Generation Node
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded demo clearance
    if (username === 'admin' && password === 'mnit2026') {
        const token = jwt.sign(
            { user: username, role: 'admin' }, 
            process.env.JWT_SECRET || 'mnit2026_hackathon_alpha_key', 
            { expiresIn: '24h' }
        );
        
        res.cookie('auth_token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        return res.json({ success: true, token });
    }
    return res.status(401).json({ error: 'Authentication Failed: Invalid Credentials' });
});

// Initialize remaining class-based agents
const synthesisAgent = new SynthesisAgent();
const interactiveAgent = new InteractiveAgent();

// Global asynchronous cache
let latestNewsCache = null;

// The asynchronous cron job cache-warmer
const runBackgroundSynthesis = async () => {
  console.log("[Cron Engine] Waking up newsWorker for background synthesis...");
  try {
    const rawArticles = await newsWorker();
    if (rawArticles.length > 0) {
      console.log("[Cron Engine] Raw articles loaded. Passing to SynthesisAgent...");
      const briefing = await synthesisAgent.generateBriefing(rawArticles);
      interactiveAgent.addContext(briefing);
      latestNewsCache = {
        ai_summary: briefing,
        original_headlines: rawArticles.map(article => article.title)
      };
      console.log("[Cron Engine] SUCCESS: Background cache is completely locked and loaded!");
    } else {
      console.warn("[Cron Engine] Warning: No articles returned from newsWorker.");
    }
  } catch(error) {
    console.error("[Cron Engine] Error during scheduled cache regeneration:", error);
  }
};

// Mount daemon to run exactly on the hour, every hour
cron.schedule('0 * * * *', runBackgroundSynthesis);

// Spin up initial background cache on server boot
runBackgroundSynthesis();



// POST endpoint for chat with the Interactive Agent
app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const stream = await interactiveAgent.askQuestionStream(message, context);
    
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    
    res.end();
  } catch (error) {
    console.error('Error in /api/chat:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process chat message' });
    } else {
      res.end("\n\n[Error: Stream interrupted]");
    }
  }
});

// POST endpoint for generating briefing
app.post('/api/briefing', authMiddleware, async (req, res) => {
  try {
    // If the cron engine has finished compiling the massive 10-article cache, drop it instantly
    if (latestNewsCache) {
      return res.json(latestNewsCache);
    }
    
    // Fallback if requested before initial cache warmup completes
    return res.json({ 
      isCompilingCache: true
    });

  } catch (error) {
    console.error('Error generating briefing in /api/briefing:', error);
    res.status(500).json({ error: 'Failed to retrieve cache briefing' });
  }
});

const portfinder = require('portfinder');

// Start the server with dynamic resilient port locking
portfinder.basePort = 5001;
portfinder.getPort((err, port) => {
    if (err) {
        console.error("Fatal: Intelligence Engine deployment failed. No network ports discovered.");
        process.exit(1);
    }
    app.listen(port, () => {
        console.log(`[Server] 🚀 Intelligence Engine active on: http://localhost:${port}`);
    });
});
