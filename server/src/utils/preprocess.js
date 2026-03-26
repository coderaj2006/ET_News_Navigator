/**
 * Preprocesses news articles before passing them to the LLM Synthesis Agent.
 * Ensures cleanly formatted text and presence of required fields.
 */
function prepareForLLM(articles) {
    if (!articles || !Array.isArray(articles)) {
        return [];
    }
    
    return articles.map(article => ({
        title: article.title ? article.title.trim() : 'Unknown Title',
        content: article.content ? article.content.trim() : 'No content available',
        publisher: article.publisher || 'Economic Times',
        date: article.date || new Date().toDateString()
    }));
}

module.exports = { prepareForLLM };