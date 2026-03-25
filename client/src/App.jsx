import React, { useState, useEffect } from 'react';

// Sub-component for Citations
const CitationBadge = ({ sourceNum }) => (
  <button 
    className="bg-blue-100 text-blue-700 rounded-md px-1.5 py-0.5 text-xs font-medium cursor-pointer hover:bg-blue-200 transition-colors inline-block"
    onClick={() => console.log(`Clicked source ${sourceNum}`)}
  >
    Source {sourceNum}
  </button>
);

// Helper to render text with citation badges inline
const renderTextWithCitations = (text) => {
  if (!text) return null;
  const regex = /\[Source (\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<CitationBadge key={match.index} sourceNum={match[1]} />);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

// Sub-component for the Skeleton Screen
const SkeletonScreen = () => (
  <div className="w-full animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-4/5 pt-4"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Hello! I am your AI analyst. How can I help you today?' }
  ]);
  const [briefingContent, setBriefingContent] = useState(
    "The global tech markets saw an unprecedented rise today as AI integrations hit the enterprise sector. Major providers have signaled a shift towards agentic workflows [Source 1].\n\nMeanwhile, renewable energy stocks took a minor dip due to supply chain constraints, though analysts remain optimistic about Q4 projections [Source 2]."
  );

  // Simulate a loading state when regenerating or fetching new intel
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([...messages, { role: 'user', content: inputText }]);
    setInputText('');
    
    // Trigger loading on the left pane as a simulated side-effect of a question
    simulateLoading();

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: 'I have updated the briefing pane with the latest intelligence based on your query.' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-slate-800 font-sans">
      
      {/* Left Pane (Briefing) */}
      <div className="w-1/2 overflow-y-auto bg-slate-50 p-8 border-r border-slate-200">
        <div className="max-w-3xl mx-auto flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Daily Intelligence Brief</h1>
            <button 
              onClick={simulateLoading}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-sm text-slate-600"
            >
              Reload
            </button>
          </div>
          
          <div className="flex-1">
            {isLoading ? (
              <SkeletonScreen />
            ) : (
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {renderTextWithCitations(briefingContent)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Pane (Interactive Agent) */}
      <div className="w-1/2 flex flex-col bg-white overflow-hidden">
        
        {/* Chat Message Area (Grows to fill space) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Height Input Bar */}
        <div className="h-20 border-t border-slate-200 bg-white p-4 flex items-center justify-center">
          <form className="w-full max-w-2xl flex gap-3 relative" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask the Analyst a question..." 
              className="flex-1 bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-full px-5 py-3 text-sm text-slate-700 placeholder-slate-400"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium text-sm transition-colors absolute right-1 top-1 bottom-1 flex items-center justify-center"
            >
              Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
