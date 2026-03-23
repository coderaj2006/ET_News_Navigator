require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import the specific agents
const fetchETNews = require('./dataAgent');
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

// Endpoint to fetch the latest news from dataAgent
app.get('/api/news', async (req, res) => {
  try {
    const news = await fetchETNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
