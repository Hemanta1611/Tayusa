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
          const mockVideos = [
            {
              _id: 'rec1',
              title: 'Machine Learning for Beginners',
              thumbnailUrl: 'https://i.ytimg.com/vi/_9WiB2PDO7k/maxresdefault.jpg',
              user: { _id: 'user1', username: 'AIExpert', profilePicture: '' },
              views: 12453,
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1420
            },
            {
              _id: 'rec2',
              title: 'React Performance Optimization Techniques',
              thumbnailUrl: 'https://i.ytimg.com/vi/YQiHumF1kLo/maxresdefault.jpg',
              user: { _id: 'user4', username: 'ReactGuru', profilePicture: '' },
              views: 8765,
              createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 843
            }
          ];
          
          // Only show 2 items - simulating not having enough content in database
          setRecommendedContent({
            videos: mockVideos,
            shorts: [],
            articles: []
          });
          
          // If we don't have enough content, fetch from YouTube
          if (mockVideos.length < 4) {
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
        
        // Mock YouTube data for development
        setTimeout(() => {
          setYoutubeContent([
            {
              _id: 'yt1',
              title: 'Advanced CSS Layouts in 2025',
              thumbnailUrl: 'https://i.ytimg.com/vi/qm0IfG1GyZU/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'CSS Masters', profilePicture: '' },
              views: 245670,
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1056,
              isYouTube: true
            },
            {
              _id: 'yt2',
              title: 'Building a Full-Stack AI App with Python and React',
              thumbnailUrl: 'https://i.ytimg.com/vi/Uw45We0RvCs/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'AI DevShow', profilePicture: '' },
              views: 187432,
              createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1843,
              isYouTube: true
            },
            {
              _id: 'yt3',
              title: 'Modern JavaScript Techniques Every Developer Should Know',
              thumbnailUrl: 'https://i.ytimg.com/vi/NCwa_xi0Uuc/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'JS Mastery', profilePicture: '' },
              views: 321098,
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 947,
              isYouTube: true
            },
            {
              _id: 'yt4',
              title: 'Docker and Kubernetes Explained in 20 Minutes',
              thumbnailUrl: 'https://i.ytimg.com/vi/2vMEQ5zS1y8/maxresdefault.jpg',
              user: { _id: 'youtube', username: 'DevOps Simplified', profilePicture: '' },
              views: 198745,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1230,
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
      {/* Recommended videos from our platform */}
      {recommendedContent.videos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedContent.videos.map(video => (
              <VideoCard key={video._id} video={video} />
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
      
      {/* Articles */}
      {recommendedContent.articles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Articles Based on Your Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedContent.articles.map(article => (
              <ArticleCard key={article._id} article={article} />
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
      {recommendedContent.videos.length === 0 && 
       recommendedContent.shorts.length === 0 && 
       recommendedContent.articles.length === 0 && 
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
