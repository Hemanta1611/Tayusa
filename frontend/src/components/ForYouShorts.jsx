import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaBookmark, FaCommentAlt, FaShare } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

function ForYouShorts() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeShorts, setYoutubeShorts] = useState([]);
  const [usingYoutubeFallback, setUsingYoutubeFallback] = useState(false);

  useEffect(() => {
    const fetchRecommendedShorts = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would call the actual API to get personalized short video recommendations
        // const response = await axios.get('/api/content/shorts/recommended');
        // setShorts(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockShorts = [
            {
              _id: 'short1',
              title: '3 Quick React Performance Tips',
              description: 'Boost your React app performance with these 3 quick tips.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://i.ytimg.com/vi/BkVRUsUgPds/maxresdefault.jpg',
              user: { 
                _id: 'user123', 
                username: 'ReactNinja', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 45632,
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
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 45
            },
            {
              _id: 'short2',
              title: 'CSS Grid vs Flexbox in 30 Seconds',
              description: 'Learn the difference between CSS Grid and Flexbox in just 30 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/YszONjKpgg4/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              user: { 
                _id: 'user123', 
                username: 'CSSWizard', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 32198,
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
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 30
            },
            {
              _id: 'short3',
              title: 'TypeScript Generic Types Explained',
              description: 'Master TypeScript generic types with this in-depth explanation.',
              thumbnailUrl: 'https://i.ytimg.com/vi/zM_ZiSl2n2E/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              user: { 
                _id: 'user123', 
                username: 'TypeScriptPro', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 18743,
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
              duration: 37
            },
            {
              _id: 'short4',
              title: 'JavaScript Array Methods You Need to Know',
              description: 'Learn the most useful JavaScript array methods in this video.',
              thumbnailUrl: 'https://i.ytimg.com/vi/ezfr9d7wd_k/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              user: { 
                _id: 'user123', 
                username: 'JSMaster', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 21354,
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
              duration: 28
            },
            {
              _id: 'short5',
              title: 'Docker in 60 Seconds',
              description: 'Learn the basics of Docker in just 60 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/pTFZFxd4hOI/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
              user: { 
                _id: 'user123', 
                username: 'DevOpsGuru', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 29876,
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
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 42
            },
            {
              _id: 'short6',
              title: 'Next.js App Router in 40 Seconds',
              description: 'Learn how to use the Next.js App Router in just 40 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/QC7j7SaZz3I/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'user123', 
                username: 'NextExpert', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 38542,
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
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 40
            }
          ];
          
          setShorts(mockShorts);
          
          // If we don't have enough content, fetch from YouTube
          if (mockShorts.length < 6) {
            fetchYouTubeShorts();
            setUsingYoutubeFallback(true);
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommended shorts:', error);
        setError('Failed to load recommendations. Please try again.');
        setLoading(false);
        
        // Fallback to YouTube content on error
        fetchYouTubeShorts();
        setUsingYoutubeFallback(true);
      }
    };
    
    const fetchYouTubeShorts = async () => {
      try {
        // In a real app, this would be an API call to our backend which then calls YouTube API
        // const response = await axios.get('/api/content/youtube-shorts');
        // setYoutubeShorts(response.data);
        
        // Mock YouTube shorts data for development
        setTimeout(() => {
          setYoutubeShorts([
            {
              _id: 'ytshort1',
              title: 'Python AI Development in 60 Seconds',
              description: 'Learn the basics of Python AI development in just 60 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/5NgNicANyqM/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube1', 
                username: 'PythonMaster', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 245670,
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
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 60,
              isYouTube: true
            },
            {
              _id: 'ytshort2',
              title: 'React Hooks Explained in 30 Seconds',
              description: 'Learn the basics of React Hooks in just 30 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube2', 
                username: 'ReactTutorials', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 187432,
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
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 30,
              isYouTube: true
            },
            {
              _id: 'ytshort3',
              title: 'GraphQL vs REST API in 45 Seconds',
              description: 'Learn the difference between GraphQL and REST API in just 45 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/yWzKJPw_VzM/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube3', 
                username: 'APIMasters', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 132098,
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
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 45,
              isYouTube: true
            },
            {
              _id: 'ytshort4',
              title: 'Blockchain Development Basics in 60 Seconds',
              description: 'Learn the basics of blockchain development in just 60 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/SSo_EIwHSd4/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube4', 
                username: 'CryptoDevs', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 98745,
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
              createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 60,
              isYouTube: true
            },
            {
              _id: 'ytshort5',
              title: 'TailwindCSS Tips and Tricks in 50 Seconds',
              description: 'Learn the best TailwindCSS tips and tricks in just 50 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/-T-SOzmPp9U/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube5', 
                username: 'CSSMasters', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 152432,
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
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 50,
              isYouTube: true
            },
            {
              _id: 'ytshort6',
              title: 'GitHub Actions CI/CD in 60 Seconds',
              description: 'Learn the basics of GitHub Actions CI/CD in just 60 seconds.',
              thumbnailUrl: 'https://i.ytimg.com/vi/cP0I9w2coGU/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              user: { 
                _id: 'youtube6', 
                username: 'DevOpsSimplified', 
                profilePicture: '',
                color: '#6366f1'
              },
              views: 187654,
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
              createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 60,
              isYouTube: true
            }
          ]);
        }, 1500);
      } catch (error) {
        console.error('Error fetching YouTube shorts:', error);
      }
    };

    fetchRecommendedShorts();
  }, [isAuthenticated, user]);

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
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (loading && !usingYoutubeFallback) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !usingYoutubeFallback && shorts.length === 0 && youtubeShorts.length === 0) {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Short Videos for You</h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div>
          {/* Shorts from our platform */}
          {shorts.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col space-y-8">
                {shorts.map(short => (
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
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              {short.user.profilePicture ? (
                                <img src={short.user.profilePicture} alt={short.user.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
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
          )}
          
          {/* YouTube Shorts Fallback */}
          {usingYoutubeFallback && youtubeShorts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">More Short Videos</h2>
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">YouTube</span>
              </div>
              <div className="flex flex-col space-y-8">
                {youtubeShorts.map(short => (
                  <div key={short._id} className="relative h-[calc(100vh-180px)] max-w-md mx-auto bg-black rounded-2xl overflow-hidden">
                    <Link to={`/shorts/${short._id}`} className="block h-full">
                      <div className="h-full w-full relative">
                        <video 
                          src={short.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"} 
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
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              {short.user.profilePicture ? (
                                <img src={short.user.profilePicture} alt={short.user.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
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
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Content from YouTube is shown when we're still building your personalized recommendations.</p>
              </div>
            </div>
          )}
          
          {/* No content message */}
          {shorts.length === 0 && youtubeShorts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-700 mb-4">
                We're still learning your preferences.
                Browse more content to get personalized recommendations!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ForYouShorts;
