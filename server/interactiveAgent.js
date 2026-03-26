// interactiveAgent.js
// Responsible for handling user interactions and querying

const { GoogleGenerativeAI } = require('@google/generative-ai');

class InteractiveAgent {
  constructor() {
    console.log("Interactive Agent initialized.");
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        systemInstruction: "You are an AI Analyst. Use the provided Intelligence Briefing context to answer the user's questions. If the user asks about a specific source, refer to the source numbers in the text."
      });
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

  /**
   * Processes a user question using the provided explicit context or falls back to stored history.
   */
  async askQuestionStream(question, context = null) {
    if (!this.model) {
      throw new Error("Generative model is not initialized (missing API key).");
    }

    try {
      // Retrieve historical depth context from Chroma Vault
      let historicalContext = "";
      try {
          const vectorStore = require('./src/utils/vectorStore');
          const searchResults = await vectorStore.searchVault(question, 3);
          if (searchResults.length > 0) {
              historicalContext = "\n\n--- VAULT RETRIEVAL (Historical Database Context) ---\n" + searchResults.join("\n\n");
          }
      } catch (err) {
          console.warn("Vector DB search failed, continuing without historical context.", err.message);
      }

      let activeHistory = this.history;
      
      if (context) {
        activeHistory = [
          { role: 'user', parts: [{ text: `Here is the latest Intelligence Briefing for context:\n\n${context}${historicalContext}` }] },
          { role: 'model', parts: [{ text: 'Understood. I have logged the briefing and am ready to answer any questions about it.' }] }
        ];
      }

      const chat = this.model.startChat({ history: activeHistory });
      const result = await chat.sendMessageStream(question);
      
      return result.stream;
    } catch (error) {
      console.error("Error asking question:", error);
      throw error;
    }
  }
}

module.exports = InteractiveAgent;
