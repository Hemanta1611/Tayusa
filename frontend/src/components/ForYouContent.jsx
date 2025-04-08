import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VideoCard from './VideoCard';
import ShortVideoCard from './ShortVideoCard';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import contentService from '../services/contentService';

function ForYouContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedContent, setRecommendedContent] = useState({
    videos: [],
    shorts: [],
    articles: []
  });
  const [youtubeContent, setYoutubeContent] = useState([]);
  const [usingYoutubeFallback, setUsingYoutubeFallback] = useState(false);

  useEffect(() => {
    const fetchRecommendedContent = async () => {
      try {
        setContentLoading(true);
        
        // In a real app, we would call the actual API to get personalized recommendations
        // const response = await contentService.getRecommendedContent();
        // const { videos, shorts, articles } = response.data;
        
        // Mock data for development
        setTimeout(() => {
          // Check if we have enough content to show
          const mockArticles = [
            {
              _id: 'art1',
              title: 'Understanding TypeScript Generics: A Comprehensive Guide',
              thumbnailUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--hoSwdTKG--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gg0iazjgkm6hnmylm35u.png',
              excerpt: 'Learn how to leverage TypeScript generics to write more reusable and type-safe code in your applications.',
              user: { _id: 'user1', username: 'TSExpert', profilePicture: '' },
              views: 8453,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: '8 min read',
              tags: ['TypeScript', 'JavaScript', 'Web Development']
            },
            {
              _id: 'art2',
              title: 'Building Microservices with Node.js and Docker',
              thumbnailUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*YTPRIwcSHTnQjUuoG_3RcA.jpeg',
              excerpt: 'A step-by-step guide to designing, developing, and deploying microservices architecture using Node.js and Docker.',
              user: { _id: 'user2', username: 'DevOpsNinja', profilePicture: '' },
              views: 6789,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: '12 min read',
              tags: ['Microservices', 'Node.js', 'Docker', 'Backend']
            },
            {
              _id: 'art3',
              title: 'The Future of Web Development: WASM and Beyond',
              thumbnailUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*f_XlL5zJj0WPXEL88GI_ZA.jpeg',
              excerpt: 'Exploring how WebAssembly is changing the landscape of web development and what\'s coming next.',
              user: { _id: 'user3', username: 'WebFuturist', profilePicture: '' },
              views: 12345,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: '10 min read',
              tags: ['WebAssembly', 'Web Development', 'Future Tech']
            },
            {
              _id: 'art4',
              title: 'Modern CSS Techniques for Responsive Layouts',
              thumbnailUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*KYoHpB5yUzF7yYaLj-nS8w.jpeg',
              excerpt: 'Discover the latest CSS techniques for building beautiful, responsive layouts that work across all devices.',
              user: { _id: 'user4', username: 'CSSMaster', profilePicture: '' },
              views: 9876,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: '7 min read',
              tags: ['CSS', 'Responsive Design', 'Frontend']
            }
          ];
          
          const mockVideos = []; // Clear videos
          
          // Only show tech-related articles in ForYouContent
          setRecommendedContent({
            videos: mockVideos, 
            shorts: [],
            articles: mockArticles
          });
          
          // If we don't have enough content, fetch from YouTube
          if (mockArticles.length < 4) {
            fetchYouTubeContent();
            setUsingYoutubeFallback(true);
          }
          
          setContentLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommended content:', error);
        setError('Failed to load recommendations. Please try again.');
        setContentLoading(false);
        
        // Fallback to YouTube content on error
        fetchYouTubeContent();
        setUsingYoutubeFallback(true);
      }
    };
    
    const fetchYouTubeContent = async () => {
      try {
        // In a real app, this would be an API call to our backend which then calls YouTube API
        // const response = await axios.get('/api/content/youtube-recommendations');
        // setYoutubeContent(response.data);
        
        // Mock YouTube data for development - Tech Articles and Videos
        setTimeout(() => {
          setYoutubeContent([
            {
              _id: 'yt1',
              title: 'The Complete Guide to GraphQL in 2025',
              thumbnailUrl: 'https://i.ytimg.com/vi/ZQL7tL2S0oQ/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'Web Simplified', profilePicture: '' },
              views: 345670,
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1956,
              isYouTube: true
            },
            {
              _id: 'yt2',
              title: 'Machine Learning: Neural Networks Explained',
              thumbnailUrl: 'https://i.ytimg.com/vi/bfmFfD2RIcg/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'AI Explained', profilePicture: '' },
              views: 287432,
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1347,
              isYouTube: true
            },
            {
              _id: 'yt3',
              title: 'React vs Vue vs Angular in 2025: Which One to Choose?',
              thumbnailUrl: 'https://i.ytimg.com/vi/T5EANujRWBc/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'JS Framework Reviews', profilePicture: '' },
              views: 532198,
              createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1847,
              isYouTube: true
            },
            {
              _id: 'yt4',
              title: 'Blockchain Development for Beginners',
              thumbnailUrl: 'https://i.ytimg.com/vi/gyMwXuJrbJQ/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'Crypto Developer Hub', profilePicture: '' },
              views: 198745,
              createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 2430,
              isYouTube: true
            }
          ]);
        }, 1500);
      } catch (error) {
        console.error('Error fetching YouTube content:', error);
      }
    };

    fetchRecommendedContent();
  }, [isAuthenticated, user]);

  if (contentLoading && !usingYoutubeFallback) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !usingYoutubeFallback) {
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
      {/* Recommended articles from our platform */}
      {recommendedContent.articles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedContent.articles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}
      
      {/* Short form content */}
      {recommendedContent.shorts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Shorts You Might Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedContent.shorts.map(short => (
              <ShortVideoCard key={short._id} video={short} />
            ))}
          </div>
        </div>
      )}
      
      {/* YouTube content fallback */}
      {usingYoutubeFallback && youtubeContent.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">More Tech Content</h2>
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">YouTube</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {youtubeContent.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Content from YouTube is provided when personalized recommendations are being created for you.</p>
          </div>
        </div>
      )}
      
      {/* No content message */}
      {recommendedContent.articles.length === 0 && 
       recommendedContent.shorts.length === 0 && 
       youtubeContent.length === 0 && (
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

export default ForYouContent;
