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
            videos: [],
            shorts: [],
            articles: [
              {
                _id: 'follow1',
                title: 'Understanding React Server Components: A Comprehensive Guide',
                thumbnailUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--5MR_dfRK--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dm6lh9po3ochw1qwm7xa.jpg',
                excerpt: 'Learn how React Server Components work and when to use them in your applications for better performance.',
                user: { _id: 'creator1', username: 'ReactMaster', profilePicture: '' },
                views: 7832,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: '11 min read',
                tags: ['React', 'Server Components', 'Web Development']
              },
              {
                _id: 'follow2',
                title: 'Advanced CSS Layout Techniques That Will Blow Your Mind',
                thumbnailUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--C1a3Quvx--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rh7cgl0pu15rgotprclo.png',
                excerpt: 'Discover lesser-known CSS layout techniques that can revolutionize your web designs.',
                user: { _id: 'creator2', username: 'CSSWizard', profilePicture: '' },
                views: 5421,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: '8 min read',
                tags: ['CSS', 'Web Design', 'Frontend']
              },
              {
                _id: 'follow3',
                title: 'JavaScript Design Patterns Every Developer Should Master',
                thumbnailUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--AO0dFdQ5--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jgmpju0lemx5kk3jjdnw.jpg',
                excerpt: 'A deep dive into essential JavaScript design patterns that will make your code more maintainable and scalable.',
                user: { _id: 'creator3', username: 'JSNinja', profilePicture: '' },
                views: 9211,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: '14 min read',
                tags: ['JavaScript', 'Design Patterns', 'Software Architecture']
              },
              {
                _id: 'follow4',
                title: 'Building Production-Ready ML Models with Python and TensorFlow',
                thumbnailUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*c_fiB-YgbnMl6nntYGBMHQ.jpeg',
                excerpt: 'A comprehensive guide to developing and deploying machine learning models that are ready for production environments.',
                user: { _id: 'creator4', username: 'PythonGuru', profilePicture: '' },
                views: 12456,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                readTime: '18 min read',
                tags: ['Python', 'Machine Learning', 'TensorFlow', 'AI']
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
      
      {/* Latest articles from followed creators */}
      {followingContent.articles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Latest Articles from Creators You Follow</h2>
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
