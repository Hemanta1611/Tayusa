import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import VideoCard from './VideoCard';
import ShortVideoCard from './ShortVideoCard';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import FollowedCreators from './FollowedCreators';
import contentService from '../services/contentService';

function FollowingContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followingContent, setFollowingContent] = useState({
    videos: [],
    shorts: [],
    articles: []
  });
  const [followedCreators, setFollowedCreators] = useState([]);

  useEffect(() => {
    const fetchFollowingContent = async () => {
      try {
        if (!isAuthenticated) {
          setContentLoading(false);
          return;
        }
        
        setContentLoading(true);
        
        // In a real app, we would call the actual API to get content from followed creators
        // const response = await contentService.getFollowingContent();
        // const { videos, shorts, articles } = response.data;
        
        // Mock data for development
        setTimeout(() => {
          const mockFollowedCreators = [
            { _id: 'creator1', username: 'ReactMaster', profilePicture: '', followers: 15432 },
            { _id: 'creator2', username: 'CSSWizard', profilePicture: '', followers: 9870 },
            { _id: 'creator3', username: 'JSNinja', profilePicture: '', followers: 12345 },
            { _id: 'creator4', username: 'PythonGuru', profilePicture: '', followers: 18920 }
          ];
          
          setFollowedCreators(mockFollowedCreators);
          
          setFollowingContent({
            videos: [
              {
                _id: 'follow1',
                title: 'Advanced React Patterns for Enterprise Applications',
                thumbnailUrl: 'https://i.ytimg.com/vi/YaZg8wg39QQ/maxresdefault.jpg',
                user: { _id: 'creator1', username: 'ReactMaster', profilePicture: '' },
                views: 7832,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 1520
              },
              {
                _id: 'follow2',
                title: 'CSS Grid vs Flexbox: When to Use Each',
                thumbnailUrl: 'https://i.ytimg.com/vi/3elGSZSWTbM/maxresdefault.jpg',
                user: { _id: 'creator2', username: 'CSSWizard', profilePicture: '' },
                views: 5421,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 896
              },
              {
                _id: 'follow3',
                title: 'JavaScript Closures Explained Once and For All',
                thumbnailUrl: 'https://i.ytimg.com/vi/vKJpN5FAeF4/maxresdefault.jpg',
                user: { _id: 'creator3', username: 'JSNinja', profilePicture: '' },
                views: 9211,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 743
              },
              {
                _id: 'follow4',
                title: 'Building AI Models with Python and TensorFlow',
                thumbnailUrl: 'https://i.ytimg.com/vi/tPYj3fFJGjk/maxresdefault.jpg',
                user: { _id: 'creator4', username: 'PythonGuru', profilePicture: '' },
                views: 12456,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 1632
              }
            ],
            shorts: [
              {
                _id: 'followShort1',
                title: 'CSS Grid in 30 Seconds',
                thumbnailUrl: 'https://i.ytimg.com/vi/EiNiSFIPIQE/maxresdefault.jpg',
                user: { _id: 'creator2', username: 'CSSWizard', profilePicture: '' },
                likes: ['user1', 'user2', 'user3'],
                comments: [{ _id: 'c1' }, { _id: 'c2' }],
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: 'followShort2',
                title: 'JavaScript Prototypes Made Simple',
                thumbnailUrl: 'https://i.ytimg.com/vi/1UTqFAorQY8/maxresdefault.jpg',
                user: { _id: 'creator3', username: 'JSNinja', profilePicture: '' },
                likes: ['user3', 'user4'],
                comments: [{ _id: 'c3' }],
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
              }
            ],
            articles: [
              {
                _id: 'followArticle1',
                title: 'Building Scalable React Applications with Redux Toolkit',
                content: 'Redux Toolkit simplifies Redux development by providing utilities to reduce boilerplate code...',
                coverImageUrl: 'https://miro.medium.com/max/1400/1*-ojFAc3Y2T1stcyK0yVm8g.png',
                user: { _id: 'creator1', username: 'ReactMaster', profilePicture: '' },
                views: 3245,
                likes: ['user1', 'user2'],
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: 8,
                techTags: ['react', 'redux', 'javascript']
              }
            ]
          });
          
          setContentLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching following content:', error);
        setError('Failed to load content from followed creators. Please try again.');
        setContentLoading(false);
      }
    };

    fetchFollowingContent();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="py-10 text-center">
        <div className="bg-gray-50 rounded-lg p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-4">See Content from Creators You Follow</h3>
          <p className="text-gray-600 mb-6">
            Sign in to follow your favorite tech content creators and see their latest posts here.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-blue-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (contentLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
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

  const hasContent = followingContent.videos.length > 0 || 
                     followingContent.shorts.length > 0 || 
                     followingContent.articles.length > 0;

  return (
    <div className="following-content pb-10">
      {/* Followed Creators Section (similar to YouTube subscriptions) */}
      <div className="mb-8 border-b pb-2">
        <FollowedCreators />
      </div>

      {/* Suggested creators to follow if authenticated */}
      {isAuthenticated && followedCreators.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Suggested Creators to Follow</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { _id: 'sugg1', username: 'WebDevSimplified', profilePicture: '', followers: 25432, tags: ['JavaScript', 'WebDev', 'Tutorials'] },
              { _id: 'sugg2', username: 'AIExplained', profilePicture: '', followers: 18970, tags: ['AI', 'Machine Learning', 'Python'] },
              { _id: 'sugg3', username: 'DevOpsJourney', profilePicture: '', followers: 12345, tags: ['DevOps', 'Docker', 'Kubernetes'] },
              { _id: 'sugg4', username: 'UXMaster', profilePicture: '', followers: 22890, tags: ['UX Design', 'UI', 'Web Design'] }
            ].map(creator => (
              <div key={creator._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-200">
                  {creator.profilePicture ? (
                    <img src={creator.profilePicture} alt={creator.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-medium">
                      {creator.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="font-medium mb-1">{creator.username}</h3>
                <p className="text-sm text-gray-500 mb-2">{creator.followers.toLocaleString()} followers</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {creator.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className="w-full py-2 bg-primary text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Latest videos from followed creators */}
      {followingContent.videos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Latest from Creators You Follow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {followingContent.videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}
      
      {/* Latest shorts from followed creators */}
      {followingContent.shorts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Latest Shorts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {followingContent.shorts.map(short => (
              <ShortVideoCard key={short._id} video={short} />
            ))}
          </div>
        </div>
      )}
      
      {/* Latest articles from followed creators */}
      {followingContent.articles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followingContent.articles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}
      
      {/* No content message when not following anyone */}
      {!hasContent && followedCreators.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-700 mb-4">
            You're not following any creators yet. 
            Follow creators to see their content here!
          </p>
          <Link 
            to="/discover" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Discover Creators
          </Link>
        </div>
      )}
    </div>
  );
}

export default FollowingContent;
