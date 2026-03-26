const { ChromaClient } = require('chromadb');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class VectorStore {
    constructor() {
        console.log("[VectorStore] Initializing ChromaDB Vector Engine...");
        // Assumes a local ChromaDB server is running (default port 8000)
        this.client = new ChromaClient({ path: "http://localhost:8000" }); 
        this.collectionName = "et_news_vault";
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
        } else {
            console.warn("[VectorStore] WARN: Missing GEMINI_API_KEY. Embeddings will fail.");
        }
    }

    async getCollection() {
        try {
            return await this.client.getOrCreateCollection({ name: this.collectionName });
        } catch (error) {
            console.error("[VectorStore] Failed to connect to ChromaDB or retrieve collection:", error.message);
            return null;
        }
    }

    async generateEmbedding(text) {
        if (!this.embeddingModel) return null;
        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch(e) {
            console.error("[VectorStore] Embedding generation failed:", e.message);
            return null;
        }
    }

    async addArticlesToVault(articles) {
        console.log(`[VectorStore] Initiating pipeline for ${articles.length} scraped articles...`);
        const collection = await this.getCollection();
        if (!collection) {
            console.warn("[VectorStore] Vault offline. Cannot save vectors.");
            return;
        }

        const ids = [];
        const embeddings = [];
        const metadatas = [];
        const documents = [];

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const textToEmbed = `Title: ${article.title}\nDate: ${article.date || 'Unknown'}\nContent: ${article.content}`;
            
            const embedding = await this.generateEmbedding(textToEmbed);
            if (embedding) {
                // Cryptographic hash replacement based on timestamp iterator
                ids.push(`doc_${Date.now()}_${i}`);
                embeddings.push(embedding);
                metadatas.push({ title: article.title, link: article.link });
                documents.push(textToEmbed);
            }
        }

        if (ids.length > 0) {
            try {
                await collection.upsert({
                    ids,
                    embeddings,
                    metadatas,
                    documents
                });
                console.log(`[Vector DB] SUCCESS: Vaulted and vectorized ${ids.length} documents into 'et_news_vault'.`);
            } catch (err) {
                console.error("[Vector DB] Upsert Failed:", err.message);
            }
        }
    }

    async searchVault(query, limit = 4) {
        console.log(`[VectorStore] Running Similarity Search for: "${query}"`);
        const collection = await this.getCollection();
        if (!collection) return [];

        const queryEmbedding = await this.generateEmbedding(query);
        if (!queryEmbedding) return [];

        try {
            const results = await collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: limit
            });

            if (results && results.documents && results.documents[0]) {
                console.log(`[Vector DB] Found ${results.documents[0].length} relevant data nodes.`);
                return results.documents[0];
            }
        } catch (err) {
             console.error("[Vector DB] Query Failed:", err.message);
        }
        
        return [];
    }
}

module.exports = new VectorStore();
