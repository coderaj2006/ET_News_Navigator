// cat <<EOF > ~/ET_News_Navigator/client/src/services/newsService.js
export const fetchLatestBriefing = async () => {
  try {
    // Note: This matches the /api/news route we added to your server
    const response = await fetch('http://localhost:5000/api/news');
    if (!response.ok) throw new Error('Backend fetch failed');
    return await response.json();
  } catch (error) {
    console.error("Data Lead Error - Fetch failed:", error);
    return { 
      success: false, 
      briefing: "Connecting to News Navigator Engine..." 
    };
  }
};
// EOF