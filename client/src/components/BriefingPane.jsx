import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import { formatTextWithCitations } from './CitationTag';

const BriefingPane = ({ isLoading, content }) => {
  return (
    <div className="w-full h-full glass-panel rounded-2xl flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-panel/50 backdrop-blur-lg flex justify-between items-center z-10 sticky top-0">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          Briefing Pane
        </h2>
        {isLoading && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="prose prose-invert max-w-none">
            <div className="text-base leading-relaxed text-text-secondary whitespace-pre-wrap">
              {formatTextWithCitations(content)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefingPane;
