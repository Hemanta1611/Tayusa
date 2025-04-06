/**
 * ML API Client for integrating with the FastAPI ML service
 * Handles content verification, classification, and recommendations
 */

const axios = require('axios');
const config = require('../config');
const logger = require('./logger');

// Configuration
const ML_API_BASE_URL = process.env.ML_API_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const RETRY_ATTEMPTS = 3;

// Create axios instance for ML API
const mlApiClient = axios.create({
  baseURL: ML_API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for logging
mlApiClient.interceptors.response.use(
  response => response,
  error => {
    logger.error(`ML API Error: ${error.message}`, {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

/**
 * Retry mechanism for API calls
 * @param {Function} apiCall - The API call function to retry
 * @param {Number} maxRetries - Maximum number of retry attempts
 * @param {Number} delay - Delay between retries in ms
 * @returns {Promise} - Promise that resolves with the API response
 */
const withRetry = async (apiCall, maxRetries = RETRY_ATTEMPTS, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      // Only retry on connection errors or 5xx server errors
      if (!error.response || error.response.status >= 500) {
        logger.warn(`Retrying ML API call, attempt ${attempt + 1} of ${maxRetries}`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for each retry (exponential backoff)
        delay *= 1.5;
      } else {
        // Don't retry for client errors (4xx)
        break;
      }
    }
  }
  
  throw lastError;
};

/**
 * Verify if content is tech-related
 * @param {Object} content - Content to verify
 * @param {String} content.title - Content title
 * @param {String} content.description - Content description
 * @param {String} content.text - Content full text (for articles)
 * @param {String} content.transcript - Content transcript (for videos)
 * @param {String} contentType - Type of content (video, article, short)
 * @param {Number} threshold - Confidence threshold
 * @returns {Promise} - Promise that resolves with verification result
 */
const verifyContent = async (content, contentType, threshold = 0.5) => {
  let endpoint;
  let payload;
  
  switch (contentType) {
    case 'video':
    case 'short':
      endpoint = '/api/ml/analyze/video';
      payload = {
        video_id: content._id || 'temp_id',
        title: content.title,
        description: content.description,
        transcript: content.transcript,
        threshold
      };
      break;
    case 'article':
      endpoint = '/api/ml/analyze/article';
      payload = {
        title: content.title,
        content: content.text || content.content,
        threshold
      };
      break;
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
  
  return withRetry(async () => {
    const response = await mlApiClient.post(endpoint, payload);
    return {
      isValid: response.data.is_tech_content,
      confidence: response.data.confidence,
      categories: response.data.categories,
      primaryCategory: response.data.primary_category
    };
  });
};

/**
 * Track user interaction with content for recommendation improvement
 * @param {String} userId - User ID
 * @param {Object} content - Content that was interacted with
 * @param {String} interactionType - Type of interaction (view, like, comment, etc.)
 * @returns {Promise} - Promise that resolves when tracking is complete
 */
const trackUserInteraction = async (userId, content, interactionType) => {
  const payload = {
    user_id: userId,
    content_id: content._id,
    content_type: content.type || 'video',
    title: content.title,
    description: content.description || '',
    text: content.text || content.content || '',
    interaction_type: interactionType
  };
  
  return withRetry(async () => {
    const response = await mlApiClient.post('/api/ml/user/interaction', payload);
    return response.data;
  });
};

/**
 * Get personalized recommendations for a user
 * @param {String} userId - User ID
 * @param {Array} contentPool - Optional pool of content to select recommendations from
 * @param {Number} count - Number of recommendations to return
 * @returns {Promise} - Promise that resolves with recommendations
 */
const getRecommendations = async (userId, contentPool = null, count = 10) => {
  const payload = {
    user_id: userId,
    count,
    content_pool: contentPool
  };
  
  return withRetry(async () => {
    const response = await mlApiClient.post('/api/ml/recommend', payload);
    return response.data.recommendations;
  });
};

/**
 * Get all tech categories supported by the ML API
 * @returns {Promise<Array>} - Promise that resolves with list of categories
 */
const getTechCategories = async () => {
  return withRetry(async () => {
    const response = await mlApiClient.get('/api/ml/categories');
    return response.data.categories;
  });
};

/**
 * Classify text into tech categories
 * @param {String} text - Text to classify
 * @param {Number} threshold - Confidence threshold
 * @param {Number} topK - Number of top categories to return
 * @returns {Promise} - Promise that resolves with classification results
 */
const classifyText = async (text, threshold = 0.5, topK = 5) => {
  const payload = {
    text,
    threshold,
    top_k: topK
  };
  
  return withRetry(async () => {
    const response = await mlApiClient.post('/api/ml/classify', payload);
    return response.data;
  });
};

module.exports = {
  verifyContent,
  trackUserInteraction,
  getRecommendations,
  getTechCategories,
  classifyText
};
