import React, { useState, useEffect } from 'react';
import BriefingCard from './components/BriefingCard';
import { fetchLatestBriefing } from './services/newsService';

function App() {
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    // Fetching the data from your running backend on port 5000
    fetchLatestBriefing()
      .then(data => setBriefing(data.briefing))
      .catch(err => console.error("Error loading news:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">
            ET <span className="text-slate-500 font-light">News Navigator</span>
          </h1>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Feed
            </span>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Area */}
      <main className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BriefingCard briefing={briefing} />
          
          {/* Placeholder for more cards or AI Insights */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm font-medium">Additional Market Analysis</p>
            <p className="text-xs italic">Processing latest trends...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;