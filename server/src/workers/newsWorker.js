const axios = require('axios');
const cheerio = require('cheerio');
const vectorStore = require('./../utils/vectorStore');
const Parser = require('rss-parser');
const path = require('path');
const fs = require('fs');

const parser = new Parser();
const ET_FEED_URL = "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms";

async function getEtNewsForWorker() {
    // ----------------------------------------------------
    // OFFLINE RAPID-PROTOTYPING SANDBOX OVERRIDE
    // ----------------------------------------------------
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
        console.log("[newsWorker] ⚠️ USE_MOCK flag activated. Bypassing ET scrape and loading internal high-fidelity mock data.");
        try {
            const mockDataPath = path.join(__dirname, '../../mockNews.json');
            const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
            
            if (mockData.length > 0) {
                // Vectorize the faux data into ChromaDB for search continuity
                vectorStore.addArticlesToVault(mockData).catch(err => {
                    console.error("[newsWorker] Mock Vector DB transmission failure:", err.message);
                });
            }
            return mockData;
        } catch (err) {
            console.error("[newsWorker] Failed to read mockNews.json. Falling back to live scrape...", err.message);
        }
    }

    try {
        console.log("[newsWorker] Fetching latest news from Economic Times...");
        const feed = await parser.parseURL(ET_FEED_URL);

        // Maximize pipeline to 10 articles for cache depth
        const topItems = feed.items.slice(0, 10);
        const topArticles = [];

        for (const item of topItems) {
            console.log(`[newsWorker] Scraping article text: ${item.title}`);
            try {
                const response = await axios.get(item.link);
                const $ = cheerio.load(response.data);

                let articleText = $('.artText').text().trim();
                
                if (!articleText) {
                    const paragraphs = [];
                    $('p').each((i, el) => {
                        paragraphs.push($(el).text().trim());
                    });
                    articleText = paragraphs.join('\n');
                }

                if (articleText.length > 100) {
                    topArticles.push({
                        title: item.title,
                        link: item.link,
                        date: item.pubDate,
                        content: articleText.substring(0, 3000) 
                    });
                }
            } catch (scrapeError) {
                console.error(`[newsWorker] Error scraping ${item.link}:`, scrapeError.message);
            }
        }

        console.log(`[newsWorker] Successfully retrieved ${topArticles.length} full-text articles.`);
        
        // Pushing aggressive semantic payloads to Chroma Vault
        if (topArticles.length > 0) {
            vectorStore.addArticlesToVault(topArticles).catch(err => {
                console.error("[newsWorker] Non-blocking generic Vector DB transmission failure:", err.message);
            });
        }

        return topArticles;

    } catch (error) {
        console.error("[newsWorker] Error in ET feed parser:", error.message);
        console.warn("[newsWorker] 🚨 Live internet scrape completely failed. Activating Hard-Drive Failover Mock Protocol...");
        
        try {
            const mockDataPath = path.join(__dirname, '../../mockNews.json');
            return JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
        } catch (mockErr) {
            console.error("[newsWorker] FATAL: Mock failover also corrupted. System incredibly starved of data.", mockErr.message);
            return [];
        }
    }
}

module.exports = getEtNewsForWorker;
