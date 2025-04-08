import React, { useState } from 'react';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';
import ForYouShorts from '../components/ForYouShorts';
import FollowingShorts from '../components/FollowingShorts';
import FollowedCreators from '../components/FollowedCreators';

function ShortVideos() {
  const [activeTab, setActiveTab] = useState('forYou');
  const [selectedCreator, setSelectedCreator] = useState(null);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selected creator when switching to For You tab
    if (tab === 'forYou') {
      setSelectedCreator(null);
    }
  };
  
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <MainHeader />
        
        {/* Main content area */}
        <div className="pt-14 px-4 pb-4">
          {/* Tabs */}
          <div className="border-b border-gray-200 mt-4">
            <div className="flex">
              <button
                onClick={() => handleTabChange('forYou')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'forYou'
                    ? 'text-primary border-primary'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                For You
              </button>
              <button
                onClick={() => handleTabChange('following')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'following'
                    ? 'text-primary border-primary'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Following
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="mt-4">
            {activeTab === 'forYou' ? (
              <ForYouShorts />
            ) : (
              <div>
                <FollowedCreators onUserSelect={handleCreatorSelect} />
                <FollowingShorts selectedCreator={selectedCreator} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortVideos;
