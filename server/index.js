// 1. Configuration & Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import your custom utilities/agents
const fetchETNews = require('./dataAgent'); // Legacy/Test agent
const SynthesisAgent = require('./synthesisAgent');
const InteractiveAgent = require('./interactiveAgent');

// Import the new Data Lead pipeline
const { getEtNewsForLLM } = require('./utils/fetchNews');
const { generateBriefing } = require('./utils/llmService');

// 2. Initialize App & Middleware
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allows your React frontend (port 3000) to talk to this server
app.use(express.json());

// Initialize class-based agents
const synthesisAgent = new SynthesisAgent();
const interactiveAgent = new InteractiveAgent();

// 3. Routes

// Health Check
app.get('/health', (req, res) => {
  res.send('Server is running and healthy');
});

// Original Test Endpoint
app.get('/test-news', async (req, res) => {
  try {
    const news = await fetchETNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

/**
 * MAIN HACKATHON ENDPOINT: News Navigator Briefing
 * This triggers the fetcher -> cleaner -> LLM chain
 */
app.get('/api/news-briefing', async (req, res) => {
    try {
        console.log("Starting Intelligence Briefing generation...");
        const cleanData = await getEtNewsForLLM(); // Fetches from ET RSS & Cleans
        const summary = await generateBriefing(cleanData); // Sends to Gemini/AI
        
        res.json({ 
            success: true, 
            briefing: summary 
        });
    } catch (error) {
        console.error("Briefing Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`🚀 News Navigator Server is running on http://localhost:${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/health`);
});