// 1. Configuration & Imports - MUST BE AT THE VERY TOP

// MUST be the very first lines
const path = require('path');
require('dotenv').config(); // Looks in the current working directory for .env

const express = require('express');
// ... rest of your code

const cors = require('cors');

// Utility imports
const { getEtNewsForLLM } = require('./utils/fetchNews');
const { generateBriefing } = require('./utils/llmService');

// 2. Initialize App
const app = express();
// Priority: Use .env port, then fallback to 5000
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" })); 
app.use(express.json());

// 3. Initialization Logs
console.log("\n--- DATA LEAD: SERVER STARTING ---");
console.log("📍 Current Dir:", __dirname);
console.log("🔑 API Key Status:", process.env.GEMINI_API_KEY ? "✅ LOADED" : "❌ MISSING");
console.log("----------------------------------\n");

// 4. Routes
app.get('/api/news', async (req, res) => {
    try {
        console.log("🚀 Fetching live data...");
        const cleanData = await getEtNewsForLLM(); 
        
        // Race condition to prevent hanging if API is slow
        const summary = await Promise.race([
            generateBriefing(cleanData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('AI Timeout')), 30000))
        ]);
        
        res.json({ success: true, briefing: summary });
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ 
            success: false, 
            briefing: "System is processing live ET feeds. Please refresh." 
        });
    }
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server active on http://localhost:${PORT}`);
});