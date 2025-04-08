import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

function FollowedCreators({ onUserSelect }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);

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
              color: '#6366f1'
            },
            { 
              _id: 'creator2', 
              username: 'CSSWizard', 
              profilePicture: '',
              color: '#ec4899'
            },
            { 
              _id: 'creator3', 
              username: 'JSNinja', 
              profilePicture: '',
              color: '#f59e0b'
            },
            { 
              _id: 'creator4', 
              username: 'PythonGuru', 
              profilePicture: '',
              color: '#10b981'
            },
            { 
              _id: 'creator5', 
              username: 'DevOpsJourney', 
              profilePicture: '',
              color: '#3b82f6'
            },
            { 
              _id: 'creator6', 
              username: 'UXMaster', 
              profilePicture: '',
              color: '#8b5cf6'
            },
            { 
              _id: 'creator7', 
              username: 'DataScientist', 
              profilePicture: '',
              color: '#ef4444'
            },
            { 
              _id: 'creator8', 
              username: 'AIExpert', 
              profilePicture: '',
              color: '#14b8a6'
            },
            { 
              _id: 'creator9', 
              username: 'CloudArch', 
              profilePicture: '',
              color: '#f97316'
            },
            { 
              _id: 'creator10', 
              username: 'MobileDev', 
              profilePicture: '',
              color: '#8b5cf6'
            },
            { 
              _id: 'creator11', 
              username: 'WebSecurity', 
              profilePicture: '',
              color: '#06b6d4'
            },
            { 
              _id: 'creator12', 
              username: 'GameDev', 
              profilePicture: '',
              color: '#ec4899'
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

  const handleCreatorClick = (creator) => {
    const isSelected = selectedCreator === creator._id;
    const newSelected = isSelected ? null : creator._id;
    setSelectedCreator(newSelected);
    
    if (onUserSelect) {
      onUserSelect(isSelected ? null : creator);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-6">
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
    <div className="overflow-x-auto py-2">
      <div className="flex space-x-4 px-4">
        {creators.map(creator => (
          <button
            key={creator._id}
            onClick={() => handleCreatorClick(creator)}
            className={`flex-shrink-0 focus:outline-none ${
              selectedCreator === creator._id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              {creator.profilePicture ? (
                <img 
                  src={creator.profilePicture} 
                  alt={creator.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white text-lg font-medium"
                  style={{ backgroundColor: creator.color }}
                >
                  {creator.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </button>
        ))}
        
        {/* Add new creator button */}
        <Link 
          to="/discover" 
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <FaPlus className="text-gray-500" />
        </Link>
      </div>
    </div>
  );
}

export default FollowedCreators;
