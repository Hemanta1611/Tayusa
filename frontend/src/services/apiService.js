/**
 * API Service
 * Centralized service for all API calls in the application
 */

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

// API base URLs
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ML_API_BASE_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000/api/ml';

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Login');
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Register');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Current User');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Content API calls
 */
export const contentService = {
  // Get content for "For You" feed
  getForYouContent: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/content/for-you?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get For You Content');
    }
  },

  // Get content from followed users
  getFollowingContent: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/content/following?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Following Content');
    }
  },

  // Get video by ID
  getVideoById: async (id) => {
    try {
      const response = await api.get(`/content/video/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Video');
    }
  },

  // Get article by ID
  getArticleById: async (id) => {
    try {
      const response = await api.get(`/content/article/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Article');
    }
  },

  // Get short video by ID
  getShortById: async (id) => {
    try {
      const response = await api.get(`/content/short/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Short');
    }
  },

  // Search content
  searchContent: async (query, filters = {}) => {
    try {
      const response = await api.get('/content/search', { 
        params: { query, ...filters } 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Search Content');
    }
  },

  // Upload video
  uploadVideo: async (videoData, onProgress) => {
    try {
      const formData = new FormData();
      Object.keys(videoData).forEach(key => {
        if (key === 'file') {
          formData.append('file', videoData.file);
        } else {
          formData.append(key, videoData[key]);
        }
      });

      const response = await api.post('/content/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Upload Video');
    }
  },

  // Upload article
  uploadArticle: async (articleData) => {
    try {
      const formData = new FormData();
      Object.keys(articleData).forEach(key => {
        if (key === 'coverImage' && articleData.coverImage) {
          formData.append('coverImage', articleData.coverImage);
        } else {
          formData.append(key, articleData[key]);
        }
      });

      const response = await api.post('/content/upload/article', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Upload Article');
    }
  },

  // Like content
  likeContent: async (contentId, contentType) => {
    try {
      const response = await api.post(`/content/${contentType}/${contentId}/like`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Like Content');
    }
  },

  // Dislike content
  dislikeContent: async (contentId, contentType) => {
    try {
      const response = await api.post(`/content/${contentType}/${contentId}/dislike`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Dislike Content');
    }
  },

  // Save content
  saveContent: async (contentId, contentType) => {
    try {
      const response = await api.post(`/content/${contentType}/${contentId}/save`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Save Content');
    }
  },

  // Add comment
  addComment: async (contentId, contentType, comment) => {
    try {
      const response = await api.post(`/content/${contentType}/${contentId}/comment`, { comment });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Add Comment');
    }
  },

  // Report content
  reportContent: async (contentId, contentType, reason) => {
    try {
      const response = await api.post(`/content/${contentType}/${contentId}/report`, { reason });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Report Content');
    }
  }
};

/**
 * User API calls
 */
export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get User Profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key === 'profilePicture' && profileData.profilePicture) {
          formData.append('profilePicture', profileData.profilePicture);
        } else {
          formData.append(key, profileData[key]);
        }
      });

      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Update Profile');
    }
  },

  // Follow user
  followUser: async (userId) => {
    try {
      const response = await api.post(`/user/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Follow User');
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/user/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Unfollow User');
    }
  },

  // Get followers
  getFollowers: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/user/${userId}/followers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Followers');
    }
  },

  // Get following
  getFollowing: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/user/${userId}/following?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get Following');
    }
  },

  // Get user's content
  getUserContent: async (userId, contentType, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/user/${userId}/content/${contentType}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Get User Content');
    }
  }
};

/**
 * ML API calls
 */
export const mlService = {
  // Verify content is tech-related
  verifyContent: async (content, contentType) => {
    try {
      let endpoint;
      let payload;
      
      switch (contentType) {
        case 'video':
        case 'short':
          endpoint = '/analyze/video';
          payload = {
            video_id: content._id || 'temp_id',
            title: content.title,
            description: content.description,
            transcript: content.transcript,
            threshold: 0.5
          };
          break;
        case 'article':
          endpoint = '/analyze/article';
          payload = {
            title: content.title,
            content: content.text || content.content,
            threshold: 0.5
          };
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }
      
      const response = await mlApi.post(endpoint, payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Verify Content');
    }
  },

  // Get content recommendations
  getRecommendations: async (userId, count = 10) => {
    try {
      const response = await mlApi.post('/recommend', { 
        user_id: userId,
        count
      });
      return response.data.recommendations;
    } catch (error) {
      throw handleApiError(error, 'Get Recommendations');
    }
  },

  // Track user interaction
  trackInteraction: async (userId, content, interactionType) => {
    try {
      const payload = {
        user_id: userId,
        content_id: content._id,
        content_type: content.type || 'video',
        title: content.title,
        description: content.description || '',
        text: content.text || content.content || '',
        interaction_type: interactionType
      };
      
      const response = await mlApi.post('/user/interaction', payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Track Interaction');
    }
  },

  // Get tech categories
  getTechCategories: async () => {
    try {
      const response = await mlApi.get('/categories');
      return response.data.categories;
    } catch (error) {
      throw handleApiError(error, 'Get Tech Categories');
    }
  }
};

export default {
  authService,
  contentService,
  userService,
  mlService
};
