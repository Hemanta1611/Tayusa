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
    <div className="bg-black min-h-screen text-white">
      <SecondHeader />
      
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-60px)]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-4">
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-60px)]">
          {/* Main content area */}
          <div className="flex-1 relative">
            {currentShort && (
              <div className="h-full">
                {/* Short Video Player */}
                <div className="relative h-full max-w-md mx-auto">
                  <video
                    src={currentShort.videoUrl}
                    poster={currentShort.thumbnailUrl}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    loop
                  />
                  
                  {/* Navigation controls */}
                  <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 z-10">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-50"
                    >
                      <FaChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === shorts.length - 1}
                      className="p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-50"
                    >
                      <FaChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Video controls on right side */}
                  <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6">
                    <button 
                      className="flex flex-col items-center text-white"
                      onClick={handleLike}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                        {userInteractions.liked ? (
                          <FaHeart className="w-5 h-5 text-red-500" />
                        ) : (
                          <FaRegHeart className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs">{currentShort.likes.length}</span>
                    </button>
                    <button 
                      className="flex flex-col items-center text-white"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                        <FaComment className="w-5 h-5" />
                      </div>
                      <span className="text-xs">{currentShort.comments?.length || 0}</span>
                    </button>
                    <button 
                      className="flex flex-col items-center text-white"
                      onClick={handleShare}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-1 hover:bg-gray-700">
                        <FaShare className="w-5 h-5" />
                      </div>
                      <span className="text-xs">Share</span>
                    </button>
                  </div>
                  
                  {/* Video info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                        {currentShort.user.profilePicture ? (
                          <img 
                            src={currentShort.user.profilePicture} 
                            alt={currentShort.user.username} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                            {currentShort.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-white">
                        <p className="text-sm font-semibold">@{currentShort.user.username}</p>
                        <p className="text-xs text-gray-300">{currentShort.techTags?.join(', ')}</p>
                      </div>
                      <button className="ml-auto bg-white text-black text-sm font-medium px-4 py-1.5 rounded-full">
                        Subscribe
                      </button>
                    </div>
                    <h3 className="text-white text-sm mb-1">{currentShort.title}</h3>
                    <p className="text-gray-300 text-xs">{currentShort.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Comments panel */}
          {showComments && currentShort && (
            <div className="w-full md:w-96 bg-gray-900 h-full overflow-y-auto border-l border-gray-800 absolute right-0 top-0 bottom-0 z-20">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Comments ({currentShort.comments?.length || 0})</h3>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-800"
                    onClick={() => setShowComments(false)}
                  >
                    <span className="sr-only">Close comments</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Add comment form */}
                {isAuthenticated && (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex items-center">
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
  );
}

export default ShortVideoPage;
