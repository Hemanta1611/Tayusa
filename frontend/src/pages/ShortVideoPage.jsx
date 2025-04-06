import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import SecondHeader from '../components/SecondHeader';
import FollowedCreators from '../components/FollowedCreators';

function ShortVideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('forYou');
  const [currentShort, setCurrentShort] = useState(null);
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [userInteractions, setUserInteractions] = useState({
    liked: false
  });

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        // In a real app, replace with actual API call
        // const response = await axios.get('/api/content/shorts');
        // setShorts(response.data.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockShorts = [
            {
              _id: 'short1',
              title: 'Quick JavaScript Tip: Array Methods',
              description: 'A useful tip about JavaScript array methods that will save you time.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://i.ytimg.com/vi/rRgD1yVwIvE/maxresdefault.jpg',
              user: {
                _id: 'user123',
                username: 'JavaScriptPro',
                profilePicture: ''
              },
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
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              techTags: ['javascript', 'webdev']
            },
            {
              _id: 'short2',
              title: 'CSS Grid in 30 Seconds',
              description: 'Learn the basics of CSS Grid layout in just 30 seconds.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              thumbnailUrl: 'https://i.ytimg.com/vi/EiNiSFIPIQE/maxresdefault.jpg',
              user: {
                _id: 'user789',
                username: 'CSSWizard',
                profilePicture: ''
              },
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
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              techTags: ['css', 'webdesign']
            },
            {
              _id: 'short3',
              title: 'React Hooks Explained',
              description: 'A quick overview of React hooks and how to use them effectively.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              thumbnailUrl: 'https://i.ytimg.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
              user: {
                _id: 'user456',
                username: 'ReactDev',
                profilePicture: ''
              },
              likes: ['user1', 'user5'],
              comments: [],
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              techTags: ['react', 'javascript']
            }
          ];
          
          setShorts(mockShorts);
          
          // Find the short with the matching id or default to the first one
          const initialIndex = mockShorts.findIndex(s => s._id === id);
          setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
          setCurrentShort(mockShorts[initialIndex >= 0 ? initialIndex : 0]);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching shorts:', err);
        setError('Failed to load short videos. Please try again.');
        setLoading(false);
      }
    };

    fetchShorts();
  }, [id]);

  // Update URL when currentShort changes
  useEffect(() => {
    if (currentShort) {
      navigate(`/shorts/${currentShort._id}`, { replace: true });
    }
  }, [currentShort, navigate]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentShort(shorts[currentIndex + 1]);
      setShowComments(false);
      setUserInteractions({ liked: false });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentShort(shorts[currentIndex - 1]);
      setShowComments(false);
      setUserInteractions({ liked: false });
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like videos');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      liked: !prev.liked
    }));
    
    // In a real app, call API to update like status
    // axios.put(`/api/content/shorts/${currentShort._id}/like`);
  };

  const handleShare = () => {
    // Copy short video URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Could not copy link: ', err));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    
    if (!comment.trim()) return;
    
    // In a real app, call API to post comment
    // axios.post(`/api/content/shorts/${currentShort._id}/comments`, { content: comment });
    
    // For now, add comment locally
    const newComment = {
      _id: `temp-${Date.now()}`,
      user: {
        _id: user?._id || 'currentUser',
        username: user?.username || 'You',
        profilePicture: user?.profilePicture || ''
      },
      content: comment,
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    setCurrentShort(prev => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])]
    }));
    
    setComment('');
  };

  return (
    <div className="short-video-page bg-black min-h-screen">
      {/* Second Header for For You / Following tabs */}
      <div className="sticky top-0 z-50 bg-black">
        <SecondHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {activeTab === 'following' ? (
        <div className="container mx-auto px-4 py-4 text-white">
          <div className="rounded-lg p-4">
            <FollowedCreators />
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center w-full py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-white w-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : shorts.length === 0 ? (
            <div className="text-center py-10 text-white w-full">
              <p>No short videos found</p>
            </div>
          ) : (
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0">
                <video
                  src={currentShort.videoUrl}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  controlsList="nodownload"
                  playsInline
                  muted
                />
                
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
              </div>
              
              {/* Navigation controls */}
              <div className="absolute left-4 inset-y-0 flex items-center">
                <button 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white disabled:opacity-30"
                >
                  <FaChevronUp size={20} />
                </button>
              </div>
              
              <div className="absolute right-4 inset-y-0 flex items-center">
                <button 
                  onClick={handleNext}
                  disabled={currentIndex === shorts.length - 1}
                  className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white disabled:opacity-30"
                >
                  <FaChevronDown size={20} />
                </button>
              </div>
              
              {/* Content info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-800">
                    {currentShort.user?.profilePicture ? (
                      <img src={currentShort.user.profilePicture} alt={currentShort.user.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
                        {currentShort.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{currentShort.user?.username || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-300 mb-2">{currentShort.title}</p>
                    <p className="text-xs text-gray-400">{currentShort.description}</p>
                  </div>
                </div>
                
                {/* Tags */}
                {currentShort.techTags && currentShort.techTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentShort.techTags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-800 text-gray-200 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Interaction buttons */}
              <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                <button 
                  onClick={handleLike}
                  className="flex flex-col items-center text-white"
                >
                  {userInteractions.liked ? (
                    <FaHeart size={30} className="text-red-500 mb-1" />
                  ) : (
                    <FaRegHeart size={30} className="mb-1" />
                  )}
                  <span className="text-xs">{(currentShort.likes?.length || 0) + (userInteractions.liked ? 1 : 0)}</span>
                </button>
                
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex flex-col items-center text-white"
                >
                  <FaComment size={30} className="mb-1" />
                  <span className="text-xs">{currentShort.comments?.length || 0}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center text-white"
                >
                  <FaShare size={30} className="mb-1" />
                  <span className="text-xs">Share</span>
                </button>
              </div>
              
              {/* Comments section */}
              {showComments && (
                <div className="absolute inset-0 bg-black bg-opacity-90 z-20 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white text-lg font-bold">Comments ({currentShort.comments?.length || 0})</h3>
                      <button 
                        onClick={() => setShowComments(false)}
                        className="text-white p-2"
                      >
                        &times;
                      </button>
                    </div>
                    
                    {isAuthenticated && (
                      <form onSubmit={handleCommentSubmit} className="mb-6">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                              {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={!comment.trim()}
                            className="ml-2 px-3 py-1 bg-primary text-white rounded-full disabled:opacity-50"
                          >
                            Post
                          </button>
                        </div>
                      </form>
                    )}
                    
                    {/* Comments list */}
                    <div className="space-y-4">
                      {currentShort.comments && currentShort.comments.length > 0 ? (
                        currentShort.comments.map(comment => (
                          <div key={comment._id} className="flex text-white">
                            <div className="mr-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                                {comment.user?.profilePicture ? (
                                  <img src={comment.user.profilePicture} alt={comment.user.username} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="font-medium mr-2">{comment.user?.username || 'Anonymous'}</span>
                                <span className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-200">{comment.content}</p>
                              <div className="mt-1 flex items-center text-xs text-gray-400">
                                <button className="flex items-center mr-4 hover:text-white">
                                  <FaRegHeart className="mr-1" />
                                  <span>{comment.likes?.length || 0}</span>
                                </button>
                                <button className="hover:text-white">Reply</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShortVideoPage;
