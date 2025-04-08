import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaBookmark, FaCommentAlt, FaShare, FaEye, FaPlay, FaClock } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

function ForYouVideos() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [usingYoutubeFallback, setUsingYoutubeFallback] = useState(false);

  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would call the actual API to get personalized video recommendations
        // const response = await axios.get('/api/content/videos/recommended');
        // setVideos(response.data);
        
        // Mock data for development
        setTimeout(() => {
          const mockVideos = [
            {
              _id: 'video1',
              title: 'Advanced React Component Patterns',
              description: 'Learn the most powerful React component patterns used by top engineers.',
              thumbnailUrl: 'https://i.ytimg.com/vi/B2q5cRJvqI8/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user1', username: 'ReactMaster', profilePicture: '' },
              views: 187632,
              likes: 24531,
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1845 // 30:45
            },
            {
              _id: 'video2',
              title: 'Full Stack Development in 2025',
              description: 'The complete guide to modern full stack development tools and practices.',
              thumbnailUrl: 'https://i.ytimg.com/vi/24ocFr9tzwg/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user2', username: 'CodeGuru', profilePicture: '' },
              views: 156743,
              likes: 18965,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2734 // 45:34
            },
            {
              _id: 'video3',
              title: 'Building Scalable APIs with Node.js',
              description: 'Learn advanced techniques for building high-performance APIs.',
              thumbnailUrl: 'https://i.ytimg.com/vi/lY6icfhap2o/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user3', username: 'BackendDev', profilePicture: '' },
              views: 132456,
              likes: 15873,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 3125 // 52:05
            },
            {
              _id: 'video4',
              title: 'Modern CSS Techniques',
              description: 'Discover powerful CSS techniques for modern web development.',
              thumbnailUrl: 'https://i.ytimg.com/vi/2acJmUg4s0I/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user4', username: 'CSSWizard', profilePicture: '' },
              views: 98754,
              likes: 12345,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2187 // 36:27
            },
            {
              _id: 'video5',
              title: 'Machine Learning with Python: From Beginner to Expert',
              description: 'A comprehensive guide to machine learning with Python covering all essential concepts.',
              thumbnailUrl: 'https://i.ytimg.com/vi/7eh4d6sabA0/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user5', username: 'PythonGuru', profilePicture: '' },
              views: 214532,
              likes: 28976,
              createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 4532 // 1:15:32
            },
            {
              _id: 'video6',
              title: 'The Complete Guide to GraphQL with Apollo Server',
              description: 'Learn how to build and optimize GraphQL APIs using Apollo Server and best practices.',
              thumbnailUrl: 'https://i.ytimg.com/vi/od0gXSXxtLs/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'user6', username: 'GraphQLExpert', profilePicture: '' },
              views: 142678,
              likes: 17654,
              createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 3845 // 1:04:05
            }
          ];
          
          setVideos(mockVideos);
          
          // If we don't have enough content, fetch from YouTube
          if (mockVideos.length < 6) {
            fetchYouTubeVideos();
            setUsingYoutubeFallback(true);
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommended videos:', error);
        setError('Failed to load recommendations. Please try again.');
        setLoading(false);
        
        // Fallback to YouTube content on error
        fetchYouTubeVideos();
        setUsingYoutubeFallback(true);
      }
    };
    
    const fetchYouTubeVideos = async () => {
      try {
        // In a real app, this would be an API call to our backend which then calls YouTube API
        // const response = await axios.get('/api/content/youtube-recommendations');
        // setYoutubeVideos(response.data);
        
        // Mock YouTube data for development
        setTimeout(() => {
          setYoutubeVideos([
            {
              _id: 'yt1',
              title: 'Next.js 14 Crash Course - Build a Full Stack App with Server Actions',
              description: 'Learn the latest features in Next.js 14 while building a complete application.',
              thumbnailUrl: 'https://i.ytimg.com/vi/7DVvj_fPWzs/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube1', username: 'NextJSExpert', profilePicture: '' },
              views: 456789,
              likes: 43290,
              createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 4756, // 1:19:16
              isYouTube: true
            },
            {
              _id: 'yt2',
              title: 'Rust Programming for JavaScript Developers',
              description: 'A beginner-friendly guide to Rust programming for developers with JavaScript background.',
              thumbnailUrl: 'https://i.ytimg.com/vi/PpWR6wViVPg/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube2', username: 'RustAcademy', profilePicture: '' },
              views: 321456,
              likes: 29876,
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 5143, // 1:25:43
              isYouTube: true
            },
            {
              _id: 'yt3',
              title: 'Building a SaaS Application from Scratch - Full Stack Tutorial',
              description: 'Complete guide to building a production-ready SaaS application with modern technologies.',
              thumbnailUrl: 'https://i.ytimg.com/vi/lV5MnQ79d_w/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube3', username: 'SaaSMaster', profilePicture: '' },
              views: 587432,
              likes: 52345,
              createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 6723, // 1:52:03
              isYouTube: true
            },
            {
              _id: 'yt4',
              title: 'Docker and Kubernetes - The Complete Guide',
              description: 'Learn everything you need to know about containerization with Docker and Kubernetes.',
              thumbnailUrl: 'https://i.ytimg.com/vi/jPdIRX6q4jA/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube4', username: 'DevOpsChannel', profilePicture: '' },
              views: 412783,
              likes: 38976,
              createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 5478, // 1:31:18
              isYouTube: true
            },
            {
              _id: 'yt5',
              title: 'TensorFlow 2.0 Complete Course - Python Neural Networks for Beginners',
              description: 'Comprehensive guide to neural networks and deep learning with TensorFlow 2.0.',
              thumbnailUrl: 'https://i.ytimg.com/vi/tPYj3fFJGjk/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube5', username: 'AILearning', profilePicture: '' },
              views: 687965,
              likes: 62145,
              createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 7634, // 2:07:14
              isYouTube: true
            },
            {
              _id: 'yt6',
              title: 'Web Security Fundamentals - Protect Your Applications',
              description: 'Learn essential techniques to secure your web applications from common vulnerabilities.',
              thumbnailUrl: 'https://i.ytimg.com/vi/3yYxVtRGOa4/maxresdefault.jpg',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              user: { _id: 'youtube6', username: 'SecurityExpert', profilePicture: '' },
              views: 356124,
              likes: 32547,
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 4325, // 1:12:05
              isYouTube: true
            }
          ]);
        }, 1500);
      } catch (error) {
        console.error('Error fetching YouTube content:', error);
      }
    };

    fetchRecommendedVideos();
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !usingYoutubeFallback) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !usingYoutubeFallback && videos.length === 0 && youtubeVideos.length === 0) {
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
    <div className="py-6">
      {/* Videos from our platform */}
      {videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recommended Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <Link to={`/video/${video._id}`} className="block relative aspect-video overflow-hidden">
                  <video 
                    src={video.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
                    poster={video.thumbnailUrl} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    preload="metadata"
                    muted
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-80 flex items-center justify-center">
                      <FaPlay className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded flex items-center">
                    <FaClock className="mr-1 text-xs" />
                    <span>{formatDuration(video.duration || 0)}</span>
                  </div>
                </Link>
                
                <div className="p-3 flex flex-1 flex-col">
                  <Link to={`/video/${video._id}`} className="block">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary transition-colors">{video.title}</h3>
                  </Link>
                  
                  <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500">
                    <Link to={`/profile/${video.user?._id}`} className="flex items-center hover:text-gray-700">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
                        {video.user?.profilePicture ? (
                          <img src={video.user.profilePicture} alt={video.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                            {video.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <span className="truncate max-w-[120px]">{video.user?.username || 'Anonymous'}</span>
                    </Link>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-2" title={`${video.views} views`}>
                        <FaEye className="mr-1 text-xs" />
                        <span>{formatNumber(video.views || 0)}</span>
                      </div>
                      <span title={video.createdAt ? new Date(video.createdAt).toLocaleString() : ''}>
                        {formatTimeAgo(new Date(video.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* YouTube Videos Fallback */}
      {usingYoutubeFallback && youtubeVideos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">More Tech Videos</h2>
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">YouTube</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {youtubeVideos.map(video => (
              <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <Link to={`/video/${video._id}`} className="block relative aspect-video overflow-hidden">
                  <video 
                    src={video.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
                    poster={video.thumbnailUrl} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    preload="metadata"
                    muted
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-80 flex items-center justify-center">
                      <FaPlay className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded flex items-center">
                    <FaClock className="mr-1 text-xs" />
                    <span>{formatDuration(video.duration || 0)}</span>
                  </div>
                </Link>
                
                <div className="p-3 flex flex-1 flex-col">
                  <Link to={`/video/${video._id}`} className="block">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary transition-colors">{video.title}</h3>
                  </Link>
                  
                  <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500">
                    <Link to={`/profile/${video.user?._id}`} className="flex items-center hover:text-gray-700">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
                        {video.user?.profilePicture ? (
                          <img src={video.user.profilePicture} alt={video.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                            {video.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <span className="truncate max-w-[120px]">{video.user?.username || 'Anonymous'}</span>
                    </Link>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-2" title={`${video.views} views`}>
                        <FaEye className="mr-1 text-xs" />
                        <span>{formatNumber(video.views || 0)}</span>
                      </div>
                      <span title={video.createdAt ? new Date(video.createdAt).toLocaleString() : ''}>
                        {formatTimeAgo(new Date(video.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Content from YouTube is shown when we're still building your personalized recommendations.</p>
          </div>
        </div>
      )}
      
      {/* No content message */}
      {videos.length === 0 && youtubeVideos.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-700 mb-4">
            We're still learning your preferences.
            Browse more content to get personalized recommendations!
          </p>
        </div>
      )}
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

export default ForYouVideos;
