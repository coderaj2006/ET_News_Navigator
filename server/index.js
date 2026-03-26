const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

// Import the specific agents
const getEtNewsForLLM = require('./src/utils/fetchNews');
const SynthesisAgent = require('./synthesisAgent');
const InteractiveAgent = require('./interactiveAgent');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize remaining class-based agents
const synthesisAgent = new SynthesisAgent();
const interactiveAgent = new InteractiveAgent();

// Test Route
app.get('/health', (req, res) => {
  res.send('Server is running');
});

// Endpoint to fetch the test news from dataAgent
app.get('/test-news', async (req, res) => {
  try {
    const news = await getEtNewsForLLM();
    if (!news || news.length === 0) {
      return res.json({ message: 'Service Currently Updating' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST endpoint for generating briefing
app.post('/api/briefing', async (req, res) => {
  try {
    const news = await getEtNewsForLLM();
    
    if (!news || news.length === 0) {
      return res.json({ message: 'Service Currently Updating' });
    }
    
    // Ensure we have at least 3 articles for the SynthesisAgent
    if (news.length < 3) {
      return res.status(400).json({ error: 'Not enough articles to generate a briefing.' });
    }
    
    const top3Articles = news.slice(0, 3);
    
    // Note: Calling generateBriefing as requested (the method is named generateBriefing, not summarize)
    const briefing = await synthesisAgent.generateBriefing(top3Articles);
    
    // Push context to the Interactive Agent for future questions
    interactiveAgent.addContext(briefing);
    
    res.json({ briefing });
  } catch (error) {
    console.error('Error generating briefing in /api/briefing:', error);
    res.status(500).json({ error: 'Failed to generate briefing' });
  }
});

// Start the server with dynamic port allocation
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${server.address().port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
