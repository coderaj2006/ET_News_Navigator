import React from 'react';

const BriefingCard = ({ briefing }) => {
  return (
    <div className="news-card bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Market Intelligence
          </span>
          <span className="text-slate-400 text-xs">Just Now</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
          Daily Financial Briefing
        </h3>
        
        <div className="space-y-4 text-slate-600 leading-relaxed">
          {briefing ? (
            <p className="whitespace-pre-wrap">{briefing}</p>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            View Source Details →
          </button>
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">AI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingCard;