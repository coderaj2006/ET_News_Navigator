const Parser = require('rss-parser');
const parser = new Parser();

const MAIN_FEED = 'https://economictimes.indiatimes.com/rssfeedsdefault.cms';
const TECH_FEED = 'https://economictimes.indiatimes.com/tech/rssfeeds/13357208.cms';

async function fetchETNews() {
  try {
    const [mainFeed, techFeed] = await Promise.all([
      parser.parseURL(MAIN_FEED),
      parser.parseURL(TECH_FEED)
    ]);

    const mapArticle = (article) => ({
      title: article.title,
      link: article.link,
      pubDate: article.pubDate,
      contentSnippet: article.contentSnippet
    });

    const mainArticles = mainFeed.items.map(mapArticle);
    const techArticles = techFeed.items.map(mapArticle);

    // Group the articles properly
    return {
      mainFeed: mainArticles,
      techFeed: techArticles
    };
  } catch (error) {
    console.error('Error fetching ET News RSS feeds:', error);
    throw error;
  }
}

module.exports = fetchETNews;
