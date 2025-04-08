import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaBookmark, FaCommentAlt, FaShare } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

function FollowingShorts({ selectedCreator }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredShorts, setFilteredShorts] = useState([]);

  useEffect(() => {
    const fetchFollowingShorts = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would call the actual API
        // const response = await axios.get('/api/content/shorts/following');
        // setShorts(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockShorts = [
            {
              _id: 'short1',
              title: 'React Hook Tricks',
              thumbnailUrl: 'https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              description: 'Master React Hooks with these advanced tricks and techniques.',
              user: { 
                _id: 'user123', 
                username: 'ReactMaster', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 23451,
              likes: ['user1', 'user2', 'user3'],
              comments: [
                {
                  _id: 'comment1',
                  user: { _id: 'user456', username: 'CodeLearner', profilePicture: '' },
                  content: 'This was super helpful! Thank you!',
                  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  likes: ['user1']
                }
              ],
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 42
            },
            {
              _id: 'short2',
              title: 'CSS Grid in 30 Seconds',
              thumbnailUrl: 'https://i.ytimg.com/vi/jV8B24rSN5o/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              description: 'Learn the basics of CSS Grid layout in just 30 seconds.',
              user: { 
                _id: 'user789', 
                username: 'CSSWizard', 
                profilePicture: '',
                color: '#ec4899'
              },
              views: 18732,
              likes: ['user3', 'user4'],
              comments: [
                {
                  _id: 'comment2',
                  user: { _id: 'user321', username: 'WebDesigner', profilePicture: '' },
                  content: 'Great explanation! So concise.',
                  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                  likes: ['user3', 'user4']
                }
              ],
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 30
            },
            {
              _id: 'short3',
              title: 'JavaScript Array Methods',
              thumbnailUrl: 'https://i.ytimg.com/vi/R8rmfD9Y5-c/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              description: 'A quick overview of JavaScript array methods and how to use them effectively.',
              user: { 
                _id: 'user456', 
                username: 'JSNinja', 
                profilePicture: '',
                color: '#f59e0b'
              },
              views: 15423,
              likes: ['user1', 'user5'],
              comments: [],
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 38
            },
            {
              _id: 'short4',
              title: 'Python One-Liners',
              thumbnailUrl: 'https://i.ytimg.com/vi/Qmv3JXXMsfw/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              description: 'Master Python one-liners with these advanced tricks and techniques.',
              user: { 
                _id: 'user789', 
                username: 'PythonGuru', 
                profilePicture: '',
                color: '#10b981'
              },
              views: 21876,
              likes: ['user1', 'user2', 'user3'],
              comments: [
                {
                  _id: 'comment3',
                  user: { _id: 'user321', username: 'CodeLearner', profilePicture: '' },
                  content: 'This was super helpful! Thank you!',
                  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  likes: ['user1']
                }
              ],
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 45
            },
            {
              _id: 'short5',
              title: 'Docker Commands to Know',
              thumbnailUrl: 'https://i.ytimg.com/vi/aCAt3CcROlA/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
              description: 'Learn the most important Docker commands to know.',
              user: { 
                _id: 'user123', 
                username: 'DevOpsJourney', 
                profilePicture: '',
                color: '#3b82f6'
              },
              views: 12543,
              likes: ['user3', 'user4'],
              comments: [
                {
                  _id: 'comment4',
                  user: { _id: 'user456', username: 'WebDesigner', profilePicture: '' },
                  content: 'Great explanation! So concise.',
                  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                  likes: ['user3', 'user4']
                }
              ],
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 36
            },
            {
              _id: 'short6',
              title: 'UX Design Tips',
              thumbnailUrl: 'https://i.ytimg.com/vi/TgqeRTwZvIo/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              description: 'Improve your UX design skills with these tips and tricks.',
              user: { 
                _id: 'user789', 
                username: 'UXMaster', 
                profilePicture: '',
                color: '#8b5cf6'
              },
              views: 19876,
              likes: ['user1', 'user5'],
              comments: [],
              createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 52
            },
            {
              _id: 'short7',
              title: 'Data Structures in 60 Seconds',
              thumbnailUrl: 'https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              description: 'Learn the basics of data structures in just 60 seconds.',
              user: { 
                _id: 'user456', 
                username: 'AlgoExpert', 
                profilePicture: '',
                color: '#ef4444'
              },
              views: 28321,
              likes: ['user1', 'user2', 'user3'],
              comments: [
                {
                  _id: 'comment5',
                  user: { _id: 'user321', username: 'CodeLearner', profilePicture: '' },
                  content: 'This was super helpful! Thank you!',
                  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  likes: ['user1']
                }
              ],
              createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 60
            }
          ];
          
          setShorts(mockShorts);
          if (selectedCreator) {
            setFilteredShorts(mockShorts.filter(short => short.user._id === selectedCreator._id));
          } else {
            setFilteredShorts(mockShorts);
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching following shorts:', error);
        setError('Failed to load short videos. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchFollowingShorts();
  }, [selectedCreator]);

  // Format numbers for views and likes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Format durations
  const formatDuration = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : filteredShorts.length === 0 ? (
        <div className="text-center py-10">
          {selectedCreator ? (
            <p className="text-gray-700">
              No short videos from {selectedCreator.username} yet.
            </p>
          ) : (
            <p className="text-gray-700">
              No short videos from your followed creators yet.
              Discover and follow more creators to see their content.
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-8">
            {selectedCreator ? (
              <h2 className="text-2xl font-bold mb-6">
                Shorts from {selectedCreator.username}
              </h2>
            ) : (
              <h2 className="text-2xl font-bold mb-6">Shorts from Creators You Follow</h2>
            )}
            
            <div className="flex flex-col space-y-8">
              {filteredShorts.map(short => (
                <div key={short._id} className="relative h-[calc(100vh-180px)] max-w-md mx-auto bg-black rounded-2xl overflow-hidden">
                  <Link to={`/shorts/${short._id}`} className="block h-full">
                    <div className="h-full w-full relative">
                      <video 
                        src={short.videoUrl}
                        poster={short.thumbnailUrl} 
                        className="h-full w-full object-cover"
                        preload="metadata"
                        muted
                        loop
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                      
                      {/* Video duration */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(short.duration)}
                      </div>

                      {/* Video controls on right side */}
                      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6">
                        <button className="flex flex-col items-center text-white">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                            <FaHeart className="w-5 h-5" />
                          </div>
                          <span className="text-xs">{formatNumber(short.likes.length)}</span>
                        </button>
                        <button className="flex flex-col items-center text-white">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                            <FaCommentAlt className="w-5 h-5" />
                          </div>
                          <span className="text-xs">{short.comments.length}</span>
                        </button>
                        <button className="flex flex-col items-center text-white">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                            <FaShare className="w-5 h-5" />
                          </div>
                          <span className="text-xs">Share</span>
                        </button>
                      </div>
                      
                      {/* Video info at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: short.user.color }}>
                            {short.user.profilePicture ? (
                              <img src={short.user.profilePicture} alt={short.user.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                {short.user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="text-white">
                            <p className="text-sm font-semibold">@{short.user.username}</p>
                            <p className="text-xs text-gray-300">{formatNumber(short.views)} views</p>
                          </div>
                          <button className="ml-auto bg-white text-black text-sm font-medium px-4 py-1.5 rounded-full">
                            Subscribe
                          </button>
                        </div>
                        <h3 className="text-white text-sm mb-1">{short.title}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowingShorts;
