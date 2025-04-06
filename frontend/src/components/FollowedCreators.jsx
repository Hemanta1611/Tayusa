import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

function FollowedCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedCreators = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get('/api/users/following');
        // setCreators(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockCreators = [
            { 
              _id: 'creator1', 
              username: 'ReactMaster', 
              profilePicture: '',
              subscribers: 15432,
              verified: true,
              latestContent: { type: 'video', title: 'Advanced React Patterns', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator2', 
              username: 'CSSWizard', 
              profilePicture: '',
              subscribers: 9870,
              verified: true,
              latestContent: { type: 'short', title: 'CSS Grid in 30 Seconds', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator3', 
              username: 'JSNinja', 
              profilePicture: '',
              subscribers: 12345,
              verified: false,
              latestContent: { type: 'article', title: 'JavaScript Closures Demystified', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator4', 
              username: 'PythonGuru', 
              profilePicture: '',
              subscribers: 18920,
              verified: true,
              latestContent: { type: 'video', title: 'Building AI Models with Python', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator5', 
              username: 'DevOpsJourney', 
              profilePicture: '',
              subscribers: 7654,
              verified: false,
              latestContent: { type: 'article', title: 'Docker Simplified', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator6', 
              username: 'UXMaster', 
              profilePicture: '',
              subscribers: 13420,
              verified: true,
              latestContent: { type: 'short', title: 'UX Design Principles', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
            },
            { 
              _id: 'creator7', 
              username: 'DataScientist', 
              profilePicture: '',
              subscribers: 22540,
              verified: true,
              latestContent: { type: 'video', title: 'Data Visualization Techniques', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) }
            }
          ];
          
          setCreators(mockCreators);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching followed creators:', error);
        setError('Failed to load followed creators');
        setLoading(false);
      }
    };
    
    fetchFollowedCreators();
  }, []);
  
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
    
    return date.toLocaleDateString();
  };
  
  // Helper to get content type icon
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <span className="text-red-500">🎬</span>;
      case 'short':
        return <span className="text-purple-500">📱</span>;
      case 'article':
        return <span className="text-blue-500">📝</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700 mb-4">
          You're not following any creators yet.
        </p>
        <Link 
          to="/discover" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Discover Creators
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4 px-4">Subscriptions</h2>
      
      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-2">
        <div className="flex px-4 space-x-6">
          {creators.map(creator => (
            <div key={creator._id} className="flex-shrink-0 w-56">
              <Link to={`/profile/${creator._id}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                  <div className="flex items-center p-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                      {creator.profilePicture ? (
                        <img src={creator.profilePicture} alt={creator.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-medium">
                          {creator.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900 truncate mr-1">{creator.username}</h3>
                        {creator.verified && <FaCheckCircle className="text-primary text-sm" />}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{creator.subscribers.toLocaleString()} subscribers</p>
                    </div>
                  </div>
                  
                  {creator.latestContent && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-gray-500 mb-1">Latest {creator.latestContent.type}:</p>
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          {getContentTypeIcon(creator.latestContent.type)}
                        </div>
                        <div>
                          <p className="text-sm line-clamp-2 font-medium text-gray-800">{creator.latestContent.title}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(creator.latestContent.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowedCreators;
