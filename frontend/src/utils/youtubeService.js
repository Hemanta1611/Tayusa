/**
 * YouTube API service
 */
import axios from 'axios';

// YouTube API key
const API_KEY = 'AIzaSyCrJvfOfG6jRo7snBXMBAr2bY5HZgTc2hc';

/**
 * Search YouTube for tech content
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return (default: 8)
 * @returns {Promise} - Promise that resolves to YouTube search results
 */
export const searchYouTube = async (query, maxResults = 8) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults,
          q: query,
          type: 'video',
          key: API_KEY
        }
      }
    );

    // Get video details for duration
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    const videoDetailsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'contentDetails,statistics',
          id: videoIds,
          key: API_KEY
        }
      }
    );

    // Map video details to results
    const videoDetailsMap = videoDetailsResponse.data.items.reduce((acc, item) => {
      acc[item.id] = {
        duration: convertYouTubeDuration(item.contentDetails.duration),
        views: parseInt(item.statistics.viewCount, 10)
      };
      return acc;
    }, {});

    // Transform YouTube results to match our app's format
    return response.data.items.map(item => ({
      id: item.id.videoId,
      type: 'video',
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      user: {
        username: item.snippet.channelTitle,
        profilePicture: ''
      },
      views: videoDetailsMap[item.id.videoId]?.views || 0,
      duration: videoDetailsMap[item.id.videoId]?.duration || '3:45',
      createdAt: item.snippet.publishedAt,
      publishedAt: formatPublishedDate(item.snippet.publishedAt),
      isYouTube: true,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
};

/**
 * Convert YouTube duration format (ISO 8601) to a readable format (e.g., "10:15" or "1:30:15")
 * @param {string} duration - YouTube duration in ISO 8601 format (e.g., PT1H30M15S)
 * @returns {string} - Formatted duration string
 */
const convertYouTubeDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = parseInt((match[1] && match[1].replace('H', '')) || 0, 10);
  const minutes = parseInt((match[2] && match[2].replace('M', '')) || 0, 10);
  const seconds = parseInt((match[3] && match[3].replace('S', '')) || 0, 10);
  
  // Format: HH:MM:SS or MM:SS
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format the publishedAt date to a relative time string (e.g., "3 months ago")
 * @param {string} publishedAt - ISO date string
 * @returns {string} - Relative time string
 */
const formatPublishedDate = (publishedAt) => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffInMs = now - published;
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (diffInYears > 0) {
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  } else if (diffInMonths > 0) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else {
    return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes} minutes ago`;
  }
};

export default {
  searchYouTube,
  convertYouTubeDuration,
  formatPublishedDate
};
