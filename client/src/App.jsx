import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { LogOut } from 'lucide-react';

let cachedBackendUrl = null;

// Dynamic Sweep Crawler ensures React is flawlessly locked onto active Node ports
const getBackendUrl = async () => {
  if (cachedBackendUrl) return cachedBackendUrl;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); 
    await fetch('http://localhost:5001/api/login', { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeoutId);
    cachedBackendUrl = 'http://localhost:5001';
  } catch (err) {
    console.warn("⚠️ Port 5001 offline or unresponsive. Shifting payload trajectory to Port 5002...");
    cachedBackendUrl = 'http://localhost:5002';
  }
  return cachedBackendUrl;
};

// User Authentication Lock Screen
const AuthModal = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const baseUrl = await getBackendUrl();
            const res = await fetch(`${baseUrl}/api/login`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                // Flash token into client session for hybrid injection
                document.cookie = `auth_token=${data.token}; path=/; max-age=86400`;
                onLogin();
            } else {
                setError(data.error || 'Authentication Blocked');
            }
        } catch (err) {
            setError('Fatal Network Interruption');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]/90 backdrop-blur-md">
            <div className="bg-[#121215] border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-indigo-600"></div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
                   <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                   Welcome back, Analyst
                </h2>
                <p className="text-slate-400 text-sm mb-8">Enter administrative credentials to access the ET Intelligence Engine.</p>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono p-3 rounded-lg mb-6">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm" placeholder="ID Sequence" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Passcode</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="w-full mt-8 bg-linear-to-br from-blue-500 to-indigo-600 text-white font-medium py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] transition-all tracking-wide">Authenticate Proxy</button>
                </form>
            </div>
        </div>
    );
};

// Sub-component for Citations
const CitationBadge = ({ sourceNum }) => (
  <button 
    className="bg-linear-to-br from-blue-500 to-indigo-600 text-white border border-white/20 rounded-md px-2 py-0.5 text-xs font-semibold cursor-pointer hover:scale-[1.05] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] inline-flex items-center mx-1 align-middle"
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

const SkeletonScreen = () => (
  <>
    {[1, 2, 3].map((card) => (
      <div key={card} className="bg-[#121215]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 col-span-2">
        <div className="w-full animate-pulse space-y-4">
          <div className="h-6 bg-slate-800 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-800 rounded w-4/5 pt-4"></div>
        </div>
      </div>
    ))}
  </>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Hello! I am your AI analyst. How can I help you today?' }
  ]);
  const [briefingContent, setBriefingContent] = useState(
    "The global tech markets saw an unprecedented rise today as AI integrations hit the enterprise sector. Major providers have signaled a shift towards agentic workflows [Source 1].\n\nMeanwhile, renewable energy stocks took a minor dip due to supply chain constraints, though analysts remain optimistic about Q4 projections [Source 2]."
  );

  useEffect(() => {
    // Soft gatecheck: unlock UI if custom token is already in browser scope
    if (document.cookie.includes('auth_token=')) {
        setIsAuthenticated(true);
    }
  }, []);

  // Trigger a full LLM scrape/cache-pull from the backend
  const fetchBriefing = async () => {
    setIsLoading(true);
    try {
      const tokenMatch = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      const token = tokenMatch ? tokenMatch[1] : '';

      const baseUrl = await getBackendUrl();
      const response = await axios.post(`${baseUrl}/api/briefing`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.isCompilingCache) {
          setBriefingContent('COMPILING_CACHE');
          setTimeout(fetchBriefing, 5000);
      } else {
          setBriefingContent(response.data.ai_summary || "Service Offline");
      }
    } catch (error) {
      console.error("Failed to fetch briefing cache:", error);
      setBriefingContent("Service Offline");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBriefing();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    // Purge the JWT auth cookie entirely from browser memory
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    // Instantly lock the UI down to the Modal gateway
    setIsAuthenticated(false);
  };

  const parseSections = (text) => {
    if (!text.includes('#### ')) return [{ title: 'Overview', content: text }];
    const parts = text.split('#### ');
    const parsed = [];
    if (parts[0].trim()) {
      parsed.push({ title: 'Executive Summary', content: parts[0].replace(/###.*?\n/g, '').trim() });
    }
    for (let i = 1; i < parts.length; i++) {
        const lines = parts[i].split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        parsed.push({ title, content });
    }
    return parsed;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    // Add user message to UI immediately, plus an empty agent message for the 'Thinking' animation
    setMessages(prev => [...prev, { role: 'user', content: userText }, { role: 'agent', content: '' }]);
    setInputText('');
    
    try {
      const tokenMatch = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      const token = tokenMatch ? tokenMatch[1] : '';

      const baseUrl = await getBackendUrl();
      const response = await fetch(`${baseUrl}/api/chat`, { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ message: userText, context: briefingContent })
      });
      
      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          streamedResponse += chunkValue;
          
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content = streamedResponse;
            return newMsgs;
          });
        }
      }
    } catch (err) {
      console.error('Network Error: Connection Lost during fetch:', err);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = '⚠️ Analyst Offline: Connection Lost. Server failed to respond.';
        return newMsgs;
      });
    }
  };

  if (!isAuthenticated) {
      return (
         <div className="flex w-full h-screen bg-[#0a0a0c] relative">
             <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute -top-[10%] -left-[5%] w-[800px] h-[800px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
               <div className="absolute -bottom-[10%] -right-[5%] w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
             </div>
             <AuthModal onLogin={() => setIsAuthenticated(true)} />
         </div>
      );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0c] text-slate-400 font-sans relative">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[800px] h-[800px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Pane (Briefing) */}
      <div className="w-1/2 overflow-y-auto p-8 border-r border-white/10 relative z-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live: ET Intelligence Feed</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">Daily Intelligence Brief</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchBriefing}
                className="px-4 py-2 text-sm bg-linear-to-br from-blue-500 to-indigo-600 border border-white/20 rounded-lg hover:scale-[1.05] transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white font-medium cursor-pointer"
              >
                Reload
              </button>
              <button 
                onClick={handleLogout}
                title="Secure Logout"
                className="p-2 text-slate-400 hover:text-red-400 bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-5 auto-rows-min pb-8 w-full">
              {isLoading || briefingContent === 'COMPILING_CACHE' ? (
                <SkeletonScreen />
              ) : (
                <>
                  {/* Dynamically Parsed Bento Cells from LLM Markdown */}
                  {parseSections(briefingContent).map((sec, i) => (
                    <div key={i} className={`bg-[#121215]/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:scale-[1.02] transition-all duration-300 ${sec.title === 'Executive Summary' || sec.title === 'Overview' || sec.title === 'Market Pulse' || sec.title === 'Tech Frontier' || sec.title === 'Global Insights' ? 'col-span-2' : 'col-span-2'}`}>
                      <h3 className="text-lg font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-linear-to-b from-blue-400 to-indigo-600 rounded-full"></span>
                        {sec.title}
                      </h3>
                      <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {renderTextWithCitations(sec.content)}
                      </div>
                    </div>
                  ))}

                  {/* Sentiment Bento Card */}
                  <div className="bg-[#121215]/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)] transition-all duration-300 flex flex-col justify-center items-center text-center col-span-1">
                     <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Est. Market Sentiment</h3>
                     <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)] tracking-tighter">BULLISH</div>
                  </div>

                  {/* Keywords Bento Card */}
                  <div className="bg-[#121215]/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 col-span-1">
                     <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Trending Vectors</h3>
                     <div className="flex flex-wrap gap-2">
                       {['#EnterpriseAI', '#Equities', '#RateCuts', '#Startups', '#SaaS', '#Compliance'].map(tag => (
                         <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors cursor-pointer">{tag}</span>
                       ))}
                     </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane (Interactive Agent) */}
      <div className="w-1/2 flex flex-col bg-[#0a0a0c] overflow-hidden">
        
        {/* Chat Message Area (Grows to fill space) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-[#121215]/80 backdrop-blur-xl border border-white/10 text-slate-300 rounded-bl-sm shadow-2xl'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : msg.content === '' ? (
                  <div className="flex items-center space-x-1.5 h-6 px-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-strong:text-white prose-a:text-blue-400">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Height Input Bar */}
        <div className="h-20 border-t border-white/10 bg-[#0a0a0c] p-4 flex items-center justify-center">
          <form className="w-full max-w-2xl flex gap-3 relative" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask the Analyst a question..." 
              className="flex-1 bg-[#121215] border border-white/10 focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500 rounded-full px-5 py-3 text-sm text-slate-300 placeholder-slate-500 transition-all shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-linear-to-br from-blue-500 to-indigo-600 hover:scale-[1.05] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 absolute right-1 top-1 bottom-1 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
