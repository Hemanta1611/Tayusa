import axios from 'axios';

// Create an axios instance with base URL and default headers
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add request interceptor to add auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// VIDEOS

/**
 * Get all videos with pagination
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with videos data
 */
const getVideos = async (params = {}) => {
  try {
    const response = await API.get('/content/videos', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch videos' };
  }
};

/**
 * Get a single video by ID
 * @param {string} id - Video ID
 * @returns {Promise} Promise with video data
 */
const getVideoById = async (id) => {
  try {
    const response = await API.get(`/content/videos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch video' };
  }
};

/**
 * Upload a new video
 * @param {FormData} videoData - Video data including file
 * @returns {Promise} Promise with the uploaded video data
 */
const uploadVideo = async (videoData) => {
  try {
    const response = await API.post('/content/videos', videoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload video' };
  }
};

/**
 * Update a video
 * @param {string} id - Video ID
 * @param {Object} updateData - Updated video data
 * @returns {Promise} Promise with the updated video data
 */
const updateVideo = async (id, updateData) => {
  try {
    const response = await API.put(`/content/videos/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update video' };
  }
};

/**
 * Delete a video
 * @param {string} id - Video ID
 * @returns {Promise} Promise with the deletion response
 */
const deleteVideo = async (id) => {
  try {
    const response = await API.delete(`/content/videos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete video' };
  }
};

/**
 * Like or unlike a video
 * @param {string} id - Video ID
 * @returns {Promise} Promise with the updated like status
 */
const toggleVideoLike = async (id) => {
  try {
    const response = await API.put(`/content/videos/${id}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update like status' };
  }
};

// SHORT VIDEOS

/**
 * Get all short videos with pagination
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with short videos data
 */
const getShortVideos = async (params = {}) => {
  try {
    const response = await API.get('/content/shorts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch short videos' };
  }
};

/**
 * Get a single short video by ID
 * @param {string} id - Short video ID
 * @returns {Promise} Promise with short video data
 */
const getShortVideoById = async (id) => {
  try {
    const response = await API.get(`/content/shorts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch short video' };
  }
};

/**
 * Upload a new short video
 * @param {FormData} shortVideoData - Short video data including file
 * @returns {Promise} Promise with the uploaded short video data
 */
const uploadShortVideo = async (shortVideoData) => {
  try {
    const response = await API.post('/content/shorts', shortVideoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload short video' };
  }
};

/**
 * Update a short video
 * @param {string} id - Short video ID
 * @param {Object} updateData - Updated short video data
 * @returns {Promise} Promise with the updated short video data
 */
const updateShortVideo = async (id, updateData) => {
  try {
    const response = await API.put(`/content/shorts/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update short video' };
  }
};

/**
 * Delete a short video
 * @param {string} id - Short video ID
 * @returns {Promise} Promise with the deletion response
 */
const deleteShortVideo = async (id) => {
  try {
    const response = await API.delete(`/content/shorts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete short video' };
  }
};

/**
 * Like or unlike a short video
 * @param {string} id - Short video ID
 * @returns {Promise} Promise with the updated like status
 */
const toggleShortVideoLike = async (id) => {
  try {
    const response = await API.put(`/content/shorts/${id}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update like status' };
  }
};

// ARTICLES

/**
 * Get all articles with pagination
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with articles data
 */
const getArticles = async (params = {}) => {
  try {
    const response = await API.get('/content/articles', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch articles' };
  }
};

/**
 * Get a single article by ID
 * @param {string} id - Article ID
 * @returns {Promise} Promise with article data
 */
const getArticleById = async (id) => {
  try {
    const response = await API.get(`/content/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch article' };
  }
};

/**
 * Create a new article
 * @param {Object} articleData - Article data
 * @returns {Promise} Promise with the created article data
 */
const createArticle = async (articleData) => {
  try {
    const response = await API.post('/content/articles', articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create article' };
  }
};

/**
 * Update an article
 * @param {string} id - Article ID
 * @param {Object} updateData - Updated article data
 * @returns {Promise} Promise with the updated article data
 */
const updateArticle = async (id, updateData) => {
  try {
    const response = await API.put(`/content/articles/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update article' };
  }
};

/**
 * Delete an article
 * @param {string} id - Article ID
 * @returns {Promise} Promise with the deletion response
 */
const deleteArticle = async (id) => {
  try {
    const response = await API.delete(`/content/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete article' };
  }
};

/**
 * Like or unlike an article
 * @param {string} id - Article ID
 * @returns {Promise} Promise with the updated like status
 */
const toggleArticleLike = async (id) => {
  try {
    const response = await API.put(`/content/articles/${id}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update like status' };
  }
};

// COMMENTS

/**
 * Get comments for a content item
 * @param {string} contentType - Type of content (videos, shorts, articles)
 * @param {string} contentId - ID of the content item
 * @param {Object} params - Query parameters for pagination
 * @returns {Promise} Promise with comments data
 */
const getComments = async (contentType, contentId, params = {}) => {
  try {
    const response = await API.get(`/content/${contentType}/${contentId}/comments`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch comments' };
  }
};

/**
 * Add a comment to a content item
 * @param {string} contentType - Type of content (videos, shorts, articles)
 * @param {string} contentId - ID of the content item
 * @param {Object} commentData - Comment data
 * @returns {Promise} Promise with the created comment data
 */
const addComment = async (contentType, contentId, commentData) => {
  try {
    const response = await API.post(`/content/${contentType}/${contentId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add comment' };
  }
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} Promise with the deletion response
 */
const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`/content/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete comment' };
  }
};

/**
 * Like or unlike a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} Promise with the updated like status
 */
const toggleCommentLike = async (commentId) => {
  try {
    const response = await API.put(`/content/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update like status' };
  }
};

// SEARCH

/**
 * Search for content across all types
 * @param {Object} params - Search parameters
 * @returns {Promise} Promise with search results
 */
const searchContent = async (params = {}) => {
  try {
    const response = await API.get('/content/search', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Search failed' };
  }
};

// SAVED CONTENT

/**
 * Get saved content for the current user
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with saved content data
 */
const getSavedContent = async (params = {}) => {
  try {
    const response = await API.get('/users/saved', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch saved content' };
  }
};

/**
 * Save or unsave a content item
 * @param {Object} saveData - Data about the content to save
 * @returns {Promise} Promise with the updated save status
 */
const toggleSaveContent = async (saveData) => {
  try {
    const response = await API.put('/users/saved', saveData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update save status' };
  }
};

// Trending and recommendations

/**
 * Get trending content
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with trending content data
 */
const getTrendingContent = async (params = {}) => {
  try {
    const response = await API.get('/content/trending', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch trending content' };
  }
};

/**
 * Get recommended content for the current user
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise} Promise with recommended content data
 */
const getRecommendedContent = async (params = {}) => {
  try {
    const response = await API.get('/content/recommended', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch recommendations' };
  }
};

const contentService = {
  // Videos
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  toggleVideoLike,
  
  // Short videos
  getShortVideos,
  getShortVideoById,
  uploadShortVideo,
  updateShortVideo,
  deleteShortVideo,
  toggleShortVideoLike,
  
  // Articles
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  
  // Comments
  getComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  
  // Search
  searchContent,
  
  // Saved content
  getSavedContent,
  toggleSaveContent,
  
  // Trending and recommendations
  getTrendingContent,
  getRecommendedContent
};

export default contentService;
