const Parser = require('rss-parser');
const parser = new Parser();

const FEED_URL = 'https://economictimes.indiatimes.com/rssfeedsdefault.cms';

async function fetchETNews() {
  try {
    const feed = await parser.parseURL(FEED_URL);

    // Return an array of objects with the required fields
    return feed.items.map((article) => ({
      title: article.title,
      link: article.link,
      date: article.pubDate,
      content: article.contentSnippet,
      publisher: 'Economic Times'
    }));
  } catch (error) {
    console.error('Error fetching ET News RSS feed:', error);
    throw error;
  }
}

module.exports = fetchETNews;
