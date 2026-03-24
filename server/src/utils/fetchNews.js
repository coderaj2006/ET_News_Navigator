// server/src/utils/fetchNews.js
const Parser = require('rss-parser');
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

        // Take the top 3 articles
        const topArticles = feed.items.slice(0, 3).map(item => ({
            title: item.title,
            content: item.contentSnippet || item.content || "No content available"
        }));

        console.log(`Fetched ${topArticles.length} articles.`);

        // Use your existing cleaning and bundling logic
        const bundledData = prepareForLLM(topArticles);

        console.log("\n--- READY FOR LLM ---");
        console.log(bundledData);
        
        return bundledData;
    } catch (error) {
        console.error("Error fetching ET news:", error.message);
    }
}

// Run it to test
getEtNewsForLLM();