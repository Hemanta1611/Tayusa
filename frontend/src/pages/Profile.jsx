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
  FaLock,
  FaCommentAlt,
  FaShare,
  FaFileVideo,
  FaTrash,
  FaPencilAlt
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoCard from '../components/VideoCard';
import ShortVideoCard from '../components/ShortVideoCard';
import ArticleCard from '../components/ArticleCard';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';

function Profile() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useSelector(state => state.auth);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');
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
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Profile Header Section */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  {/* Cover Photo */}
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    {user.coverPhoto && (
                      <img 
                        src={user.coverPhoto} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="px-6 py-6 flex flex-col md:flex-row">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center md:items-start">
                      <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold -mt-16 border-4 border-white shadow-sm">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.username} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <div className="mt-4 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                      </div>
                      
                      {isOwnProfile ? (
                        <div className="ml-auto">
                          <Link
                            to="/profile/edit"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            <FaUserEdit className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                            Edit Profile
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={handleFollow}
                          className={`mt-4 inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                            isFollowing 
                              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
                              : 'border-transparent text-white bg-primary hover:bg-blue-700'
                          }`}
                        >
                          <FaUsers className="mr-2" />
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-6 md:mt-0 md:ml-8 flex-1">
                      {/* Bio/Tagline */}
                      <p className="text-gray-700 mb-4">{user.bio}</p>
                      
                      {/* Stats */}
                      <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stats.followers}</p>
                          <p className="text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stats.following}</p>
                          <p className="text-gray-500">Following</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {content.videos.length + content.shorts.length + content.articles.length}
                          </p>
                          <p className="text-gray-500">Total Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                          <p className="text-gray-500">Views</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex">
                    <button
                      onClick={() => handleTabChange('articles')}
                      className={`py-3 px-4 text-sm font-medium border-b-2 ${
                        activeTab === 'articles'
                          ? 'text-primary border-primary'
                          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <FaNewspaper className="mr-2" />
                        Articles
                      </span>
                    </button>
                    <button
                      onClick={() => handleTabChange('shorts')}
                      className={`py-3 px-4 text-sm font-medium border-b-2 ${
                        activeTab === 'shorts'
                          ? 'text-primary border-primary'
                          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <FaFileVideo className="mr-2" />
                        Short Videos
                      </span>
                    </button>
                    <button
                      onClick={() => handleTabChange('videos')}
                      className={`py-3 px-4 text-sm font-medium border-b-2 ${
                        activeTab === 'videos'
                          ? 'text-primary border-primary'
                          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <FaVideo className="mr-2" />
                        Videos
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Content */}
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
              </div>
            </> 
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
