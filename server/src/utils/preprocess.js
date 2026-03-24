// preprocess.js

/**
 * Clean strings by removing ad-related noise.
 * @param {string} text 
 * @returns {string}
 */
const cleanText = (text) => {
    return text
        .replace(/Click here|Subscribe now|Read more|Ad:|Sign up for our newsletter/gi, "")
        .replace(/\s\s+/g, ' ') // Remove extra whitespace
        .trim();
};

/**
 * Bundles articles and checks word count limit.
 * @param {Array} articles - Array of {title, content} objects
 * @param {number} maxWords - Word limit for the LLM context
 * @returns {string}
 */
const prepareForLLM = (articles, maxWords = 4000) => {
    let bundledString = articles
        .map((art, index) => {
            const cleanContent = cleanText(art.content);
            return `Source ${index + 1}: [${art.title}] - [${cleanContent}]`;
        })
        .join(" | ");

    // Word count check
    const wordCount = bundledString.split(/\s+/).length;

    if (wordCount > maxWords) {
        console.warn(`⚠️ Warning: Total text is ${wordCount} words, exceeding the ${maxWords} limit.`);
        // Simple truncation for safety (optional)
        return bundledString.split(/\s+/).slice(0, maxWords).join(" ");
    }

    console.log(`✅ Success: Prepared ${wordCount} words for API call.`);
    return bundledString;
};

// --- HACKATHON EXAMPLE USAGE ---

const rawArticles = [
    { 
        title: "Budget 2026: Tech Sector", 
        content: "New tax breaks for AI startups. Click here to read more." 
    },
    { 
        title: "ET Market Update", 
        content: "Nifty hits record high. Subscribe now for daily alerts. Market stays bullish." 
    },
    { 
        title: "Policy Shift", 
        content: "Union Budget prioritizes green energy. Sign up for our newsletter for deep dives." 
    }
];

const finalPayload = prepareForLLM(rawArticles);
console.log("\n--- BUNDLED PAYLOAD ---\n");
console.log(finalPayload);

// ... (your cleaning logic and prepareForLLM function code here) ...

// THIS IS THE CRITICAL PART:
module.exports = { 
    prepareForLLM 
};