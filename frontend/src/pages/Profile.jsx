import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUserEdit, 
  FaUsers, 
  FaVideo, 
  FaNewspaper, 
  FaClock,
  FaHeart,
  FaBookmark,
  FaEye,
  FaLock
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoCard from '../components/VideoCard';
import ShortVideoCard from '../components/ShortVideoCard';
import ArticleCard from '../components/ArticleCard';

function Profile() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useSelector(state => state.auth);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [content, setContent] = useState({
    videos: [],
    shorts: [],
    articles: [],
    savedContent: []
  });
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // In a real app, replace with actual API call
        // const response = await axios.get(`/api/users/${id}`);
        // setUser(response.data.data);
        
        // Mock data for development
        setTimeout(() => {
          const userId = id || 'user123';
          
          // Check if viewing own profile
          const isOwn = currentUser && (userId === currentUser._id || userId === 'user123');
          setIsOwnProfile(isOwn);
          
          setUser({
            _id: userId,
            username: isOwn ? 'YourUsername' : 'TechExplorer',
            name: isOwn ? 'Your Name' : 'Tech Explorer',
            email: isOwn ? 'your.email@example.com' : 'tech.explorer@example.com',
            bio: isOwn 
              ? 'Your bio - Edit your profile to change this.' 
              : 'Tech enthusiast and content creator sharing knowledge about web development, AI, and programming languages.',
            profilePicture: '',
            coverPhoto: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
            website: 'https://example.com',
            location: 'San Francisco, CA',
            joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          setStats({
            followers: isOwn ? 42 : 256,
            following: isOwn ? 65 : 124,
            totalViews: isOwn ? 1250 : 45280,
            totalLikes: isOwn ? 320 : 1865
          });
          
          setIsFollowing(!isOwn && Math.random() > 0.5);
          
          setLoading(false);
        }, 1000);
        
        // In a real app, fetch content based on selected tab
        setTimeout(() => {
          setContent({
            videos: [
              {
                _id: 'video1',
                title: 'Introduction to React Hooks',
                thumbnailUrl: 'https://i.ytimg.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
                user: { _id: id || 'user123', username: 'TechExplorer', profilePicture: '' },
                views: 3245,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 840
              },
              {
                _id: 'video2',
                title: 'Building a Full-Stack Application with MERN',
                thumbnailUrl: 'https://i.ytimg.com/vi/7CqJlxBYj-M/maxresdefault.jpg',
                user: { _id: id || 'user123', username: 'TechExplorer', profilePicture: '' },
                views: 1876,
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 1200
              },
            ],
            shorts: [
              {
                _id: 'short1',
                title: 'CSS Grid in 30 Seconds',
                thumbnailUrl: 'https://i.ytimg.com/vi/EiNiSFIPIQE/maxresdefault.jpg',
                user: { _id: id || 'user123', username: 'TechExplorer', profilePicture: '' },
                likes: ['user1', 'user2', 'user3'],
                comments: [{ _id: 'c1' }, { _id: 'c2' }],
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: 'short2',
                title: 'JavaScript Array Method Tips',
                thumbnailUrl: 'https://i.ytimg.com/vi/rRgD1yVwIvE/maxresdefault.jpg',
                user: { _id: id || 'user123', username: 'TechExplorer', profilePicture: '' },
                likes: ['user3', 'user4'],
                comments: [{ _id: 'c3' }],
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              },
            ],
            articles: [
              {
                _id: 'article1',
                title: 'Understanding State Management in React',
                content: 'State management is a crucial part of any React application...',
                coverImageUrl: 'https://miro.medium.com/max/1400/1*4y9V5936WdJKaIeVPFEa3w.png',
                user: { _id: id || 'user123', username: 'TechExplorer', profilePicture: '' },
                views: 2145,
                likes: ['user1', 'user2'],
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: 7,
                techTags: ['react', 'javascript', 'redux']
              }
            ],
            savedContent: []
          });
        }, 1500);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser]);

  const handleFollow = () => {
    if (!isAuthenticated) {
      alert('Please login to follow users');
      return;
    }
    
    setIsFollowing(prev => !prev);
    
    // In a real app, call API to update follow status
    // axios.put(`/api/users/${id}/follow`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // In a real app, fetch content for the selected tab
    // axios.get(`/api/users/${id}/${tab}`).then(response => {
    //   setContent(prev => ({ ...prev, [tab]: response.data.data }));
    // });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-700 mb-4">User not found</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover photo and profile info */}
      <div className="relative">
        <div className="h-60 w-full overflow-hidden">
          <img 
            src={user.coverPhoto || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 flex flex-col md:flex-row items-start md:items-end">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white bg-white z-10">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-medium">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="md:ml-6 mt-4 md:mt-0 mb-4 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mb-1">@{user.username}</p>
              <p className="text-gray-700 mb-3">{user.bio}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 gap-x-4 gap-y-2">
                {user.location && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                    {user.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  Joined {new Date(user.joinedDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              {isOwnProfile ? (
                <Link 
                  to="/settings/profile" 
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full"
                >
                  <FaUserEdit className="mr-2" />
                  Edit Profile
                </Link>
              ) : (
                <button 
                  onClick={handleFollow}
                  className={`flex items-center px-4 py-2 rounded-full ${isFollowing ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-primary hover:bg-blue-700 text-white'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <FaUsers className="mr-1" />
              <span className="font-bold text-xl">{stats.followers}</span>
            </div>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <FaUsers className="mr-1" />
              <span className="font-bold text-xl">{stats.following}</span>
            </div>
            <p className="text-gray-600">Following</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <FaEye className="mr-1" />
              <span className="font-bold text-xl">{stats.totalViews}</span>
            </div>
            <p className="text-gray-600">Total Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <FaHeart className="mr-1" />
              <span className="font-bold text-xl">{stats.totalLikes}</span>
            </div>
            <p className="text-gray-600">Total Likes</p>
          </div>
        </div>
      </div>
      
      {/* Content tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange('videos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaVideo className="inline mr-2" />
              Videos
            </button>
            <button
              onClick={() => handleTabChange('shorts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shorts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaVideo className="inline mr-2" />
              Shorts
            </button>
            <button
              onClick={() => handleTabChange('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'articles' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaNewspaper className="inline mr-2" />
              Articles
            </button>
            {isOwnProfile && (
              <button
                onClick={() => handleTabChange('saved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaBookmark className="inline mr-2" />
                Saved
              </button>
            )}
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'videos' && (
          content.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
              {isOwnProfile && (
                <p className="text-gray-600 mb-4">
                  Share your knowledge with the community by uploading your first video.
                </p>
              )}
              {isOwnProfile && (
                <Link
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
                >
                  Upload Video
                </Link>
              )}
            </div>
          )
        )}
        
        {activeTab === 'shorts' && (
          content.shorts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {content.shorts.map(short => (
                <ShortVideoCard key={short._id} video={short} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shorts yet</h3>
              {isOwnProfile && (
                <p className="text-gray-600 mb-4">
                  Create bite-sized content to share quick tips and insights.
                </p>
              )}
              {isOwnProfile && (
                <Link
                  to="/upload?type=short"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
                >
                  Create Short
                </Link>
              )}
            </div>
          )
        )}
        
        {activeTab === 'articles' && (
          content.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.articles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaNewspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              {isOwnProfile && (
                <p className="text-gray-600 mb-4">
                  Share your insights and knowledge with in-depth articles.
                </p>
              )}
              {isOwnProfile && (
                <Link
                  to="/upload?type=article"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
                >
                  Write Article
                </Link>
              )}
            </div>
          )
        )}
        
        {activeTab === 'saved' && (
          isOwnProfile ? (
            content.savedContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render saved content here */}
                <p>Saved content will be shown here</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved content</h3>
                <p className="text-gray-600">
                  Content you save will appear here for easy access.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FaLock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">This content is private</h3>
              <p className="text-gray-600">
                Only the owner can view their saved content.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
