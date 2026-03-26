// interactiveAgent.js
// Responsible for handling user interactions and querying

const { GoogleGenerativeAI } = require('@google/generative-ai');

class InteractiveAgent {
  constructor() {
    console.log("Interactive Agent initialized.");
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    } else {
      console.warn("GEMINI_API_KEY is missing for Interactive Agent.");
    }

    // Initialize conversation history
    this.history = [];
  }

  /**
   * Ingests the latest Intelligence Briefing to provide context for future dialogue.
   */
  addContext(briefingText) {
    this.history.push({
      role: 'user',
      parts: [{ text: `Here is the latest Intelligence Briefing for context:\n\n${briefingText}` }]
    });
    
    this.history.push({
      role: 'model',
      parts: [{ text: 'Understood. I have logged the briefing and am ready to answer any questions about it.' }]
    });
    
    console.log("Briefing successfully added to Interactive Agent's context history.");
  }

  // TODO: Add methods to handle dialogue and queries
}

module.exports = InteractiveAgent;
