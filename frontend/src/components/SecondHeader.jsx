import React from 'react';
import { motion } from 'framer-motion';

function SecondHeader({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center md:justify-start">
          <div className="relative flex space-x-8">
            <button
              className={`py-4 px-1 relative whitespace-nowrap ${
                activeTab === 'forYou' ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('forYou')}
            >
              For You
              {activeTab === 'forYou' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  layoutId="secondHeaderIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
            <button
              className={`py-4 px-1 relative whitespace-nowrap ${
                activeTab === 'following' ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('following')}
            >
              Following
              {activeTab === 'following' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  layoutId="secondHeaderIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondHeader;
