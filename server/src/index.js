// 1. Configuration & Imports
const path = require('path');
require('dotenv').config(); // Automatically looks for .env in the folder where you run the server

const express = require('express');
const cors = require('cors');

// Note: Ensure these utility files exist in your 'server/src/utils' folder
const { getEtNewsForLLM } = require('./utils/fetchNews');
const { generateBriefing } = require('./utils/llmService');

// 2. Initialize App & Middleware
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" })); 
app.use(express.json());

// 3. DEBUG LOGS (Crucial for verifying the API Key)
console.log("\n==========================================");
console.log("🚀 NEWS NAVIGATOR SERVER INITIALIZING");
console.log(`📍 Directory: ${__dirname}`);
console.log(`🔑 API Key Loaded: ${process.env.GEMINI_API_KEY ? "✅ YES" : "❌ NO"}`);
console.log("==========================================\n");

// 4. Routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    keyLoaded: !!process.env.GEMINI_API_KEY 
  });
});

app.get('/api/news', async (req, res) => {
    try {
        console.log("🚀 Starting Intelligence Briefing generation...");
        
        // Step 1: Fetch & Clean
        const cleanData = await getEtNewsForLLM(); 
        console.log("✅ News Fetched & Cleaned");

        // Step 2: Generate AI Briefing with 15s Timeout
        const summary = await Promise.race([
            generateBriefing(cleanData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('AI Timeout')), 15000))
        ]);
        
        console.log("✨ Briefing Generated Successfully");
        res.json({ success: true, briefing: summary });

    } catch (error) {
        console.error("❌ Briefing Error:", error.message);
        
        // Dynamic Fallback message if AI fails
        let fallbackMsg = "System is processing live ET feeds. Please refresh in a moment.";
        if (!process.env.GEMINI_API_KEY) {
            fallbackMsg = "CRITICAL ERROR: Gemini API Key is missing from .env file.";
        }
        
        res.status(200).json({ 
            success: false, 
            briefing: fallbackMsg,
            error: error.message 
        });
    }
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server listening on: http://localhost:${PORT}`);
    console.log(`📡 Test endpoint: http://localhost:${PORT}/api/news`);
});