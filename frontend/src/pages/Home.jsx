import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ContentNavigation from '../components/ContentNavigation';
import ForYouContent from '../components/ForYouContent';
import FollowingContent from '../components/FollowingContent';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('all');
  const [activeTab, setActiveTab] = useState('forYou');
  
  useEffect(() => {
    // Just a small delay to simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handler to receive content type selection from ContentNavigation
  const handleContentTypeChange = (type) => {
    setContentType(type);
  };

  // Handler to receive tab selection from ContentNavigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Sticky navigation with tabs and filters */}
      <ContentNavigation 
        onTabChange={handleTabChange} 
        onCategoryChange={handleContentTypeChange}
        activeTab={activeTab}
        activeCategory={contentType}
      />
      
      <div className="container mx-auto px-4 py-4">
        {/* Dynamic content based on active tab */}
        {activeTab === 'forYou' ? (
          <ForYouContent contentType={contentType} />
        ) : (
          <FollowingContent contentType={contentType} />
        )}
        
        {/* Join Community CTA */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white my-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join the Tayusa Tech Community</h2>
              <p className="text-lg mb-6">
                Connect with tech enthusiasts, share your knowledge, and learn from experts
                in web development, programming, AI, and more.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-white text-primary font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Sign Up Now
                </Link>
                <Link 
                  to="/about" 
                  className="px-6 py-3 border border-white text-white font-medium rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
