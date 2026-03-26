import React from 'react';

const CitationTag = ({ sourceId, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-1.5 py-0.5 mx-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary-hover border border-primary/20 hover:border-primary/40 rounded-full transition-colors duration-200 cursor-pointer align-text-bottom"
    >
      Source {sourceId}
    </button>
  );
};

// Helper function to parse text and replace [Source X] with the CitationTag component
export const formatTextWithCitations = (text) => {
  if (!text) return null;
  // Regex to match [Source X] where X is a number
  const regex = /\[Source (\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add the citation component
    parts.push(
      <CitationTag 
        key={`citation-${match.index}`} 
        sourceId={match[1]} 
        onClick={() => console.log(`Clicked source ${match[1]}`)}
      />
    );
    lastIndex = regex.lastIndex;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default CitationTag;
