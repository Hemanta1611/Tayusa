import React from 'react';

function ContentNavigation({ activeTab = 'forYou', activeCategory = 'all', onTabChange, onCategoryChange }) {
  // Handle tab change
  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-14 z-10">
      {/* Main tabs (For You, Following) */}
      <div className="flex w-full border-b">
        <button
          onClick={() => handleTabChange('forYou')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'forYou'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => handleTabChange('following')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'following'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Following
        </button>
      </div>

      {/* Categories (All, Videos, Shorts, Articles) */}
      <div className="flex overflow-x-auto px-4 py-2 no-scrollbar">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-1 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange('videos')}
          className={`px-4 py-1 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'videos'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => handleCategoryChange('shorts')}
          className={`px-4 py-1 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'shorts'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Shorts
        </button>
        <button
          onClick={() => handleCategoryChange('articles')}
          className={`px-4 py-1 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'articles'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Articles
        </button>
      </div>
    </div>
  );
}

export default ContentNavigation;
