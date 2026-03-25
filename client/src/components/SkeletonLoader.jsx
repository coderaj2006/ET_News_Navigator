import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="w-full space-y-6 animate-pulse p-4">
      {/* Article Title Skeleton */}
      <div className="h-8 bg-border rounded-md w-3/4"></div>
      
      {/* Metadata Skeleton */}
      <div className="flex space-x-4">
        <div className="h-4 bg-border rounded w-24"></div>
        <div className="h-4 bg-border rounded w-32"></div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-5/6"></div>
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-4/5"></div>
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-3/4"></div>
      </div>

      <div className="space-y-3 pt-6">
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-11/12"></div>
        <div className="h-4 bg-border rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
