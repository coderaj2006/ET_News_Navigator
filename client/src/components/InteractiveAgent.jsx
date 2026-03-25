import React, { useState } from 'react';

const InteractiveAgent = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: "Hello! I'm your AI analyst. Ask me questions about the briefing or specific sources." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newUserMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    
    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'agent', 
        content: "I'm analyzing the sources for your request. In a full implementation, I would provide a specific answer with [Source 1] citations here." 
      }]);
    }, 1000);
  };

  return (
    <div className="w-full h-full glass-panel rounded-2xl flex flex-col overflow-hidden relative">
      <div className="px-6 py-4 border-b border-border bg-panel/50 backdrop-blur-lg z-10">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          Interactive Agent
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.role === 'user' 
                ? 'bg-primary text-white ml-12 rounded-br-sm' 
                : 'bg-border/50 text-text-primary mr-12 rounded-bl-sm border border-border/80'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-panel/80 backdrop-blur-md">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-background/80 border border-border text-text-primary rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-full transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InteractiveAgent;
