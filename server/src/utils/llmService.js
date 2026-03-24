const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateBriefing(bundledText) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert business analyst for the News Navigator. 
        Synthesize the following articles into a single, interactive intelligence briefing.
        Focus on impact, trends, and key takeaways.
        Articles: ${bundledText}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateBriefing };