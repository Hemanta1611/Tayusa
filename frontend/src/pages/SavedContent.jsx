import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaBookmark, 
  FaRegBookmark, 
  FaComment, 
  FaShare,
  FaClock
} from 'react-icons/fa';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function SavedContent() {
  const [activeTab, setActiveTab] = useState('articles');
  const [savedContent, setSavedContent] = useState({
    articles: [],
    shortVideos: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        setLoading(true);
        // In a real app, this would be API calls to fetch saved content
        // const articlesResponse = await contentService.getSavedArticles();
        // const shortVideosResponse = await contentService.getSavedShortVideos();
        // const videosResponse = await contentService.getSavedVideos();
        
        // Mock data for development
        setTimeout(() => {
          const mockSavedContent = {
            articles: [
              {
                _id: 'article1',
                title: 'Understanding React Hooks',
                description: 'A comprehensive guide to using React Hooks in your applications.',
                coverImageUrl: 'https://i.ytimg.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
                user: { _id: 'user1', username: 'ReactMaster', profilePicture: '' },
                likes: 342,
                comments: 28,
                readTime: 8,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'article2',
                title: 'Best Practices for REST API Design',
                description: 'Learn the principles and best practices for designing robust REST APIs.',
                coverImageUrl: 'https://i.ytimg.com/vi/sXedPQ_dAog/maxresdefault.jpg',
                user: { _id: 'user2', username: 'ApiGuru', profilePicture: '' },
                likes: 256,
                comments: 19,
                readTime: 12,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'article3',
                title: 'CSS Grid vs Flexbox: When to Use Each',
                description: 'A detailed comparison of CSS Grid and Flexbox with practical examples.',
                coverImageUrl: 'https://i.ytimg.com/vi/qZv-rNx0jEA/maxresdefault.jpg',
                user: { _id: 'user3', username: 'CSSWizard', profilePicture: '' },
                likes: 187,
                comments: 14,
                readTime: 6,
                createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              }
            ],
            shortVideos: [
              {
                _id: 'short1',
                title: 'React useState Hook in 30 Seconds',
                description: 'Master the React useState hook in just 30 seconds!',
                thumbnailUrl: 'https://i.ytimg.com/vi/O6P86uwfdR0/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                user: { _id: 'user1', username: 'ReactMaster', profilePicture: '', color: '#6366f1' },
                views: 12543,
                likes: ['user1', 'user2', 'user3'],
                comments: [
                  {
                    _id: 'comment1',
                    user: { _id: 'user321', username: 'WebDesigner', profilePicture: '' },
                    content: 'Great explanation! So concise.',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    likes: ['user1']
                  }
                ],
                duration: 30,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'short2',
                title: 'Quick Tailwind CSS Tip',
                description: 'A quick tip for using Tailwind CSS more effectively!',
                thumbnailUrl: 'https://i.ytimg.com/vi/cZc4Jn5nK3k/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                user: { _id: 'user4', username: 'TailwindDev', profilePicture: '', color: '#10b981' },
                views: 8765,
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
                duration: 45,
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'short3',
                title: 'JavaScript Array Methods You Need to Know',
                description: 'Essential JavaScript array methods every developer should know!',
                thumbnailUrl: 'https://i.ytimg.com/vi/R8rmfD9Y5-c/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                user: { _id: 'user5', username: 'JSNinja', profilePicture: '', color: '#f59e0b' },
                views: 15423,
                likes: ['user1', 'user5', 'user3'],
                comments: [
                  {
                    _id: 'comment3',
                    user: { _id: 'user321', username: 'WebDesigner', profilePicture: '' },
                    content: 'Great explanation! So concise.',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    likes: ['user1']
                  }
                ],
                duration: 38,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              }
            ],
            videos: [
              {
                _id: 'video1',
                title: 'Complete React Tutorial for Beginners',
                description: 'A complete tutorial for beginners to learn React.js from scratch.',
                thumbnailUrl: 'https://i.ytimg.com/vi/QFaFIcGhPoM/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                user: { _id: 'user1', username: 'ReactMaster', profilePicture: '' },
                views: 45678,
                likes: 3456,
                comments: 234,
                duration: 1845, // 30:45
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'video2',
                title: 'Learn Node.js and Express for Backend Development',
                description: 'Comprehensive guide to building backend applications with Node.js and Express.',
                thumbnailUrl: 'https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                user: { _id: 'user6', username: 'BackendDev', profilePicture: '' },
                views: 32456,
                likes: 2134,
                comments: 147,
                duration: 3723, // 1:02:03
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              },
              {
                _id: 'video3',
                title: 'TypeScript Crash Course',
                description: 'Learn the basics of TypeScript in this comprehensive crash course.',
                thumbnailUrl: 'https://i.ytimg.com/vi/BCg4U1FzODs/maxresdefault.jpg',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                user: { _id: 'user7', username: 'TypeScriptPro', profilePicture: '' },
                views: 21345,
                likes: 1654,
                comments: 98,
                duration: 2256, // 37:36
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                saved: true
              }
            ]
          };
          
          setSavedContent(mockSavedContent);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching saved content:', error);
        setError('Failed to load saved content. Please try again later.');
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchSavedContent();
    }
  }, [isAuthenticated, user]);

  const handleToggleSave = (type, contentId) => {
    // In a real app, this would dispatch an action to toggle saved status
    setSavedContent(prevState => {
      const updatedContent = { ...prevState };
      updatedContent[type] = prevState[type].map(item => 
        item._id === contentId ? { ...item, saved: !item.saved } : item
      );
      return updatedContent;
    });
  };

  const handleToggleLike = (type, contentId) => {
    // In a real app, this would dispatch an action to toggle like status
    setSavedContent(prevState => {
      const updatedContent = { ...prevState };
      updatedContent[type] = prevState[type].map(item => {
        if (item._id === contentId) {
          const liked = item.liked || false;
          return { 
            ...item, 
            liked: !liked,
            likes: liked ? item.likes - 1 : item.likes + 1
          };
        }
        return item;
      });
      return updatedContent;
    });
  };

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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderSavedArticles = () => {
    if (savedContent.articles.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't saved any articles yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedContent.articles.map(article => (
          <div key={article._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <Link to={`/article/${article._id}`} className="block">
              <div className="relative aspect-video">
                <img 
                  src={article.coverImageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/article/${article._id}`} className="block">
                <h3 className="font-medium text-lg text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.description}</p>
              </Link>
              
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">
                  {article.user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{article.user.username}</p>
                  <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleToggleLike('articles', article._id)}
                    className="text-gray-500 hover:text-red-500 flex items-center space-x-1"
                  >
                    {article.liked ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span className="text-xs">{formatNumber(article.likes)}</span>
                  </button>
                  <button className="text-gray-500 hover:text-primary flex items-center space-x-1">
                    <FaComment />
                    <span className="text-xs">{article.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-xs text-gray-500">
                    <FaClock className="mr-1" />
                    {article.readTime} min read
                  </span>
                  <button 
                    onClick={() => handleToggleSave('articles', article._id)}
                    className="text-gray-500 hover:text-primary"
                  >
                    {article.saved ? (
                      <FaBookmark className="text-primary" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSavedShortVideos = () => {
    if (savedContent.shortVideos.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't saved any short videos yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {savedContent.shortVideos.map(video => (
          <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <Link to={`/shorts/${video._id}`} className="block">
              <div className="relative">
                <div className="aspect-[9/16] overflow-hidden bg-gray-100">
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
            </Link>
            
            <div className="p-3">
              <Link to={`/shorts/${video._id}`} className="block">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{video.title}</h3>
              </Link>
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                  {video.user.username.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs text-gray-700">{video.user.username}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{formatNumber(video.views)} views</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggleLike('shortVideos', video._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    {video.liked ? (
                      <FaHeart className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleToggleSave('shortVideos', video._id)}
                    className="text-gray-500 hover:text-primary"
                  >
                    {video.saved ? (
                      <FaBookmark className="w-4 h-4 text-primary" />
                    ) : (
                      <FaRegBookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSavedVideos = () => {
    if (savedContent.videos.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't saved any videos yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedContent.videos.map(video => (
          <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <Link to={`/video/${video._id}`} className="block">
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
            </Link>
            
            <div className="p-3">
              <Link to={`/video/${video._id}`} className="block">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
              </Link>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">
                  {video.user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{video.user.username}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatNumber(video.views)} views</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleToggleLike('videos', video._id)}
                    className="text-gray-500 hover:text-red-500 flex items-center space-x-1"
                  >
                    {video.liked ? (
                      <FaHeart className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-4 h-4" />
                    )}
                    <span className="text-xs">{formatNumber(video.likes)}</span>
                  </button>
                  <button className="text-gray-500 hover:text-primary flex items-center space-x-1">
                    <FaComment className="w-4 h-4" />
                    <span className="text-xs">{video.comments}</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleToggleSave('videos', video._id)}
                    className="text-gray-500 hover:text-primary"
                  >
                    {video.saved ? (
                      <FaBookmark className="w-4 h-4 text-primary" />
                    ) : (
                      <FaRegBookmark className="w-4 h-4" />
                    )}
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
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <MainHeader />
        
        {/* Main content area */}
        <div className="pt-16 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Saved Content</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'articles'
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Articles
                </button>
                <button
                  onClick={() => setActiveTab('shortVideos')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'shortVideos'
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Short Videos
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'videos'
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Videos
                </button>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                {activeTab === 'articles' && renderSavedArticles()}
                {activeTab === 'shortVideos' && renderSavedShortVideos()}
                {activeTab === 'videos' && renderSavedVideos()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedContent;
