// server/src/utils/fetchNews.js
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const { prepareForLLM } = require('./preprocess'); // Import your cleaning script

const parser = new Parser();
const ET_FEED_URL = 'https://economictimes.indiatimes.com/rssfeedstopstories.cms';

/**
 * Fetches the latest news from ET and prepares it for the LLM.
 */
async function getEtNewsForLLM() {
    try {
        console.log("Fetching latest news from Economic Times...");
        const feed = await parser.parseURL(ET_FEED_URL);

        const topItems = feed.items.slice(0, 8);
        const topArticles = [];

        for (const item of topItems) {
            let fullContent = item.contentSnippet || item.content || "No content available";
            
            if (item.link) {
                try {
                    const response = await axios.get(item.link);
                    const $ = cheerio.load(response.data);
                    
                    let extractedText = '';
                    $('.artText').each((i, el) => {
                        extractedText += $(el).text() + '\n';
                    });
                    
                    if (!extractedText.trim()) {
                        $('p').each((i, el) => {
                            extractedText += $(el).text() + '\n';
                        });
                    }
                    
                    if (extractedText.trim()) {
                        fullContent = extractedText.trim();
                    }
                } catch (err) {
                    console.error(`Failed to scrape article ${item.link}:`, err.message);
                }
            }

            topArticles.push({
                title: item.title,
                content: fullContent,
                date: item.pubDate || new Date().toISOString()
            });
        }

        console.log(`Fetched and scraped ${topArticles.length} articles.`);

        // Use your existing cleaning and bundling logic
        const bundledData = prepareForLLM(topArticles);

        console.log("\n--- READY FOR LLM ---");
        
        return bundledData;
    } catch (error) {
        console.error("Error fetching ET news:", error.message);
        return []; // Return empty array on failure
    }
}

module.exports = getEtNewsForLLM;