import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaBookmark, FaCommentAlt, FaShare } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

function FollowingVideos({ selectedCreator }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchFollowingVideos = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would call the actual API
        // const response = await axios.get('/api/content/videos/following');
        // setVideos(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockVideos = [
            {
              _id: 'fvid1',
              title: 'Advanced React Hooks and Context API',
              description: 'Learn how to use React Hooks and Context API to manage state in your applications.',
              thumbnailUrl: 'https://i.ytimg.com/vi/O6P86uwfdR0/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator1', 
                username: 'ReactMaster', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 34512,
              likes: 2345,
              createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2345 // 39:05
            },
            {
              _id: 'fvid2',
              title: 'Responsive Design with CSS Grid and Flexbox',
              description: 'Master advanced CSS layout techniques to create responsive and beautiful websites.',
              thumbnailUrl: 'https://i.ytimg.com/vi/qZv-rNx0jEA/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator2', 
                username: 'CSSWizard', 
                profilePicture: '',
                color: '#ec4899'
              },
              views: 23451,
              likes: 1876,
              createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1856 // 30:56
            },
            {
              _id: 'fvid3',
              title: 'JavaScript Closures and Prototypes',
              description: 'Deep dive into JavaScript closures, prototypes, and inheritance patterns.',
              thumbnailUrl: 'https://i.ytimg.com/vi/qikxEIxsXco/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator3', 
                username: 'JSNinja', 
                profilePicture: '',
                color: '#f59e0b'
              },
              views: 19873,
              likes: 1543,
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2765 // 46:05
            },
            {
              _id: 'fvid4',
              title: 'Python for Data Science and Machine Learning',
              description: 'Comprehensive guide to using Python for data analysis and machine learning.',
              thumbnailUrl: 'https://i.ytimg.com/vi/r-uOLxNrNk8/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator4', 
                username: 'PythonGuru', 
                profilePicture: '',
                color: '#10b981'
              },
              views: 45321,
              likes: 3210,
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 4532 // 1:15:32
            },
            {
              _id: 'fvid5',
              title: 'Docker and Kubernetes for Microservices',
              description: 'Learn how to containerize and orchestrate microservices using Docker and Kubernetes.',
              thumbnailUrl: 'https://i.ytimg.com/vi/Rt5G5Gj7RP0/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator5', 
                username: 'DevOpsJourney', 
                profilePicture: '',
                color: '#3b82f6'
              },
              views: 18765,
              likes: 1432,
              createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 3245 // 54:05
            },
            {
              _id: 'fvid6',
              title: 'UX Design Principles for Developers',
              description: 'Essential UX design principles every developer should know to create better user experiences.',
              thumbnailUrl: 'https://i.ytimg.com/vi/wIuVvCaGCmI/maxresdefault.jpg',
              videoUrl: '',
              user: { 
                _id: 'creator6', 
                username: 'UXMaster', 
                profilePicture: '',
                color: '#8b5cf6'
              },
              views: 22345,
              likes: 1765,
              createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2876 // 47:56
            }
          ];
          
          setVideos(mockVideos);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching following videos:', error);
        setError('Failed to load videos from creators you follow.');
        setLoading(false);
      }
    };
    
    fetchFollowingVideos();
  }, [isAuthenticated, user]);

  // Filter videos based on selected creator
  useEffect(() => {
    if (selectedCreator) {
      setFilteredVideos(videos.filter(video => video.user._id === selectedCreator._id));
    } else {
      setFilteredVideos(videos);
    }
  }, [selectedCreator, videos]);

  // Format numbers for views and likes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Format durations
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
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

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-10">
        {selectedCreator ? (
          <p className="text-gray-700">
            No videos from {selectedCreator.username} yet.
          </p>
        ) : (
          <p className="text-gray-700">
            No videos from your followed creators yet.
            Discover and follow more creators to see their content.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        {selectedCreator ? (
          <h2 className="text-xl font-bold mb-4">
            Videos from {selectedCreator.username}
          </h2>
        ) : (
          <h2 className="text-xl font-bold mb-4">Videos from Creators You Follow</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
                <div className="flex items-center mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-2"
                    style={{ backgroundColor: video.user.color }}
                  >
                    {video.user.profilePicture ? (
                      <img 
                        src={video.user.profilePicture} 
                        alt={video.user.username} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : video.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{video.user.username}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatNumber(video.views)} views</span>
                      <span className="mx-1">•</span>
                      <span>{formatTimeAgo(new Date(video.createdAt))}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-3">
                    <button className="text-gray-500 hover:text-primary">
                      <FaHeart className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-primary">
                      <FaCommentAlt className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button className="text-gray-500 hover:text-primary">
                      <FaBookmark className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-primary">
                      <FaShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to format the time
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

export default FollowingVideos;
