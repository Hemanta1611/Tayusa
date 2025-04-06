import React from 'react';

/**
 * Skeleton loading components for various content types
 * Used to show loading states while content is being fetched
 */

// Video card skeleton for loading states
export const VideoCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-gray-200" />
      
      <div className="p-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* User info skeleton */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="flex mt-2 justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    </div>
  );
};

// Short video card skeleton
export const ShortVideoCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[9/16] bg-gray-200 relative">
        <div className="absolute bottom-2 left-2 right-2">
          <div className="h-5 bg-gray-300 rounded mb-1 w-2/3"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Article card skeleton
export const ArticleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Cover image skeleton */}
      <div className="aspect-[2/1] bg-gray-200" />
      
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Description skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        
        {/* User and stats skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// User card skeleton for following/followers sections
export const UserCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  );
};

// Content grid skeleton - reusable for various content types
export const ContentGridSkeleton = ({ count = 8, type = 'video' }) => {
  const skeletons = [];
  let SkeletonComponent;
  
  switch (type) {
    case 'short':
      SkeletonComponent = ShortVideoCardSkeleton;
      break;
    case 'article':
      SkeletonComponent = ArticleCardSkeleton;
      break;
    case 'user':
      SkeletonComponent = UserCardSkeleton;
      break;
    case 'video':
    default:
      SkeletonComponent = VideoCardSkeleton;
      break;
  }
  
  for (let i = 0; i < count; i++) {
    skeletons.push(
      <div key={`skeleton-${type}-${i}`}>
        <SkeletonComponent />
      </div>
    );
  }
  
  // Different grid layouts based on content type
  const gridClasses = {
    video: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    short: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
    article: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    user: "grid grid-cols-1 gap-3"
  };
  
  return (
    <div className={gridClasses[type]}>
      {skeletons}
    </div>
  );
};

// Feed skeleton for the home page
export const FeedSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      
      {/* Content skeleton */}
      <ContentGridSkeleton count={4} type="video" />
      
      {/* Another section */}
      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded w-1/5 mb-4"></div>
        <ContentGridSkeleton count={3} type="short" />
      </div>
      
      {/* Final section */}
      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <ContentGridSkeleton count={2} type="article" />
      </div>
    </div>
  );
};

// Empty state component for when there's no content
export const EmptyState = ({ 
  title = "No content found", 
  message = "There's nothing here yet.",
  icon: Icon = null,
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 text-gray-400">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
};

export default {
  VideoCardSkeleton,
  ShortVideoCardSkeleton,
  ArticleCardSkeleton,
  UserCardSkeleton,
  ContentGridSkeleton,
  FeedSkeleton,
  EmptyState
};
