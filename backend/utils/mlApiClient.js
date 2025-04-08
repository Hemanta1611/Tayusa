/**
 * ML API Client for integrating with the FastAPI ML service
 * Handles content verification, classification, and recommendations
 */

const fetch = require('node-fetch');
const logger = require('./logger');

// Configuration
const ML_API_BASE_URL = process.env.ML_API_URL || 'https://fastapi-app-9b98.onrender.com';
const DEFAULT_TIMEOUT = 30000; // Increased to 30 seconds
const RETRY_ATTEMPTS = 3;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyCrJvfOfG6jRo7snBXMBAr2bY5HZgTc2hc';

// Create axios instance for YouTube API
const youtubeClient = require('axios').create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: DEFAULT_TIMEOUT,
  params: {
    key: YOUTUBE_API_KEY
  }
});

// Add response interceptor for logging
youtubeClient.interceptors.response.use(
  response => response,
  error => {
    logger.error(`YouTube API Error: ${error.message}`, {
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
 * Verify if content is tech-related and classify domain
 * @param {Object} content - Content to verify
 * @param {String} content.title - Content title
 * @param {String} content.description - Content description
 * @param {String} content.text - Content full text (for articles)
 * @param {String} content.transcript - Content transcript (for videos)
 * @param {String} content.videoPath - Path to video file (for video content)
 * @param {String} contentType - Type of content (video, article, shortVideo)
 * @param {Number} threshold - Confidence threshold
 * @returns {Promise} - Promise that resolves with verification result
 */
const verifyContent = async (content, contentType, threshold = 0.5) => {
  try {
    // For video content, extract audio and convert to text if transcript is not provided
    let transcript = '';
    if ((contentType === 'video' || contentType === 'shortVideo') && !content.transcript) {
      if (content.videoPath) {
        transcript = await extractTranscriptFromVideo(content.videoPath);
        logger.info(`Generated transcript from video: ${transcript.substring(0, 100)}...`);
      } else {
        logger.error('Video path not provided for transcript extraction');
        return {
          isValid: false,
          requiresManualVerification: true,
          category: 'unknown',
          confidence: 0,
          message: 'Video path not provided for content verification.'
        };
      }
    } else if (contentType === 'article') {
      transcript = content.text || content.content || '';
    } else {
      transcript = content.transcript || '';
    }
    
    // Prepare payload for tech verification
    // For video content, select random portions of text if transcript is too long
    let textForVerification = '';
    if (contentType === 'video' || contentType === 'shortVideo') {
      // For long transcripts, select random portions
      if (transcript.length > 1000) {
        textForVerification = selectRandomTextPortions(transcript, 3, 300);
        logger.info(`Selected random portions from transcript for verification: ${textForVerification.substring(0, 100)}...`);
      } else {
        textForVerification = transcript;
      }
    } else {
      // For articles, use full text
      textForVerification = transcript;
    }
    
    const payload = {
      title: content.title || '',
      description: content.description || '',
      content: textForVerification
    };
    
    logger.info(`Verifying content: ${content.title}`, { contentType });
    
    // Step 1: Verify if content is tech-related using first API
    let techResponse;
    try {
      // Make a direct fetch call to 1st API
      const response = await fetch(`${ML_API_BASE_URL}/predict_tech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      logger.info(`Tech prediction raw response: ${responseText}`);
      
      // Try to parse as JSON, otherwise use as string
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText.includes('tech') ? 'tech' : 'non_tech';
      }
      
      techResponse = { data: responseData };
    } catch (error) {
      logger.error(`Tech prediction API error: ${error.message}`);
      // If the API is down, implement fallback logic
      // For demo, we'll assume content with tech keywords is tech-related
      const techKeywords = ['code', 'programming', 'developer', 'software', 'engineering', 'tech', 'technology', 
                           'data', 'algorithm', 'computer', 'javascript', 'python', 'java', 'react', 'angular'];
      const contentText = `${payload.title} ${payload.description} ${payload.content}`.toLowerCase();
      const containsTechKeyword = techKeywords.some(keyword => contentText.includes(keyword.toLowerCase()));
      
      techResponse = { data: containsTechKeyword ? 'tech' : 'non_tech' };
      logger.info(`Using fallback tech detection: ${techResponse.data}`);
    }
    
    // Extract prediction from response properly
    let isTech;
    if (techResponse.data) {
      if (typeof techResponse.data === 'object' && techResponse.data.result) {
        // Handle format: { result: "technical-related" } or { result: "Not technical-related" }
        isTech = techResponse.data.result.toLowerCase().includes('technical-related') && 
                !techResponse.data.result.toLowerCase().includes('not') ? 'tech' : 'non_tech';
      } else if (typeof techResponse.data === 'string') {
        // Handle string response
        isTech = techResponse.data.toLowerCase().includes('technical-related') && 
                !techResponse.data.toLowerCase().includes('not') ? 'tech' : 'non_tech';
      } else {
        // Handle other formats
        isTech = (techResponse.data.prediction || techResponse.data === 'tech') ? 'tech' : 'non_tech';
      }
    } else {
      isTech = 'non_tech';
    }
    
    logger.info(`Tech prediction result: ${isTech}`);
    
    // Step 2: Domain classification - only continue if tech content
    let domainCategory = 'general';
    if (isTech === 'tech') {
      // For domain classification, we can use more of the transcript
      if (contentType === 'video' || contentType === 'shortVideo') {
        if (transcript.length > 1500) {
          // Use larger portions for domain classification
          payload.content = selectRandomTextPortions(transcript, 5, 300);
          logger.info(`Selected random portions from transcript for domain classification: ${payload.content.substring(0, 100)}...`);
        }
      }
      
      let domainResponse;
      try {
        // Direct fetch call to 2nd API for domain prediction
        const response = await fetch(`${ML_API_BASE_URL}/predict_domain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        const responseText = await response.text();
        logger.info(`Domain prediction raw response: ${responseText}`);
        
        // Try to parse as JSON, otherwise use as string
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = responseText.trim();
        }
        
        domainResponse = { data: responseData };
        
        // Extract domain from response
        if (domainResponse.data) {
          if (typeof domainResponse.data === 'object' && domainResponse.data.domain) {
            // Handle format: { domain: "Web Development" } or { domain: "Unknown Domain" }
            domainCategory = domainResponse.data.domain === "Unknown Domain" ? 
                            "general" : domainResponse.data.domain;
          } else if (typeof domainResponse.data === 'string') {
            // Handle string response
            domainCategory = domainResponse.data.trim();
          } else {
            // Handle other formats
            domainCategory = domainResponse.data.prediction || 'general';
          }
        } else {
          domainCategory = 'general';
        }
      } catch (error) {
        logger.error(`Domain classification API error: ${error.message}`);
        // Use fallback classification
        domainCategory = getKeywordBasedDomain(payload);
        logger.info(`Using fallback domain classification: ${domainCategory}`);
      }
    }
    
    const result = {
      isValid: isTech === 'tech',
      requiresManualVerification: isTech !== 'tech',
      category: isTech === 'tech' ? domainCategory : 'non_tech',
      confidence: 0.85, // Placeholder since we don't have actual confidence scores
      message: isTech === 'tech' 
        ? `Content verified as tech-related and classified as: ${domainCategory}`
        : 'Content may not be tech-related. Consider requesting manual verification.',
      transcript: transcript // Include the transcript for storage
    };
    
    return result;
  } catch (error) {
    logger.error(`Content verification failed: ${error.message}`);
    return {
      isValid: false,
      requiresManualVerification: true,
      category: 'unknown',
      confidence: 0,
      message: `Content verification failed: ${error.message}`
    };
  }
};

/**
 * Extract transcript from video file using a transcription service
 * @param {String} videoPath - Path to the video file
 * @returns {Promise<String>} - Promise that resolves with the transcript
 */
const extractTranscriptFromVideo = async (videoPath) => {
  try {
    logger.info(`Extracting transcript from video: ${videoPath}`);
    
    // For this implementation, we'll simulate audio extraction and transcription
    // In a real implementation, you would:
    // 1. Extract audio from video using ffmpeg or similar
    // 2. Convert audio to text using a transcription service like AWS Transcribe, Google Speech-to-Text, etc.
    
    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return dummy transcript for demonstration
    // In production, replace with actual transcription
    return "This is a simulated transcript from the video. In a real implementation, this would contain the actual text extracted from the video's audio track. You would typically use a service like AWS Transcribe, Google Speech-to-Text, or a similar service to convert the audio to text. The transcript would then be used for content verification and domain classification.";
  } catch (error) {
    logger.error(`Transcript extraction failed: ${error.message}`);
    return ""; // Return empty string on failure
  }
};

/**
 * Select random portions of text for processing
 * @param {String} text - Full text to select from
 * @param {Number} portions - Number of portions to select
 * @param {Number} portionLength - Length of each portion
 * @returns {String} - Combined random portions
 */
const selectRandomTextPortions = (text, portions = 3, portionLength = 300) => {
  try {
    // Split text into sentences or paragraphs
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= portions) {
      return text; // Return full text if it's shorter than needed
    }
    
    const selectedPortions = [];
    const maxStartIndex = sentences.length - 1;
    
    // Select random starting points and extract portions
    for (let i = 0; i < portions; i++) {
      const startIndex = Math.floor(Math.random() * maxStartIndex);
      let portion = '';
      let currentIndex = startIndex;
      
      // Build portion until we reach desired length or run out of sentences
      while (portion.length < portionLength && currentIndex < sentences.length) {
        portion += sentences[currentIndex] + '. ';
        currentIndex++;
      }
      
      selectedPortions.push(portion);
    }
    
    // Join portions with separators
    return selectedPortions.join(' [...] ');
  } catch (error) {
    logger.error(`Error selecting random text portions: ${error.message}`);
    // Return first portion of text as fallback
    return text.length > 1000 ? text.substring(0, 1000) + '...' : text;
  }
};

/**
 * Get keyword-based domain classification
 * @param {Object} payload - Content payload
 * @returns {String} - Detected domain
 */
const getKeywordBasedDomain = (payload) => {
  const domainKeywords = {
    'web': ['javascript', 'html', 'css', 'web', 'frontend', 'react', 'angular', 'vue'],
    'mobile': ['android', 'ios', 'flutter', 'react native', 'mobile', 'app'],
    'data_science': ['data', 'machine learning', 'ml', 'analytics', 'visualization', 'statistics'],
    'backend': ['server', 'api', 'database', 'sql', 'nosql', 'node', 'express', 'django'],
    'devops': ['docker', 'kubernetes', 'ci/cd', 'pipeline', 'deployment', 'aws', 'cloud'],
    'cybersecurity': ['security', 'encryption', 'firewall', 'vulnerability', 'hacking']
  };
  
  const contentText = `${payload.title} ${payload.description} ${payload.content}`.toLowerCase();
  
  // Find which domain has the most keyword matches
  let maxMatches = 0;
  let result = 'general';
  
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const matches = keywords.filter(keyword => contentText.includes(keyword.toLowerCase())).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      result = domain;
    }
  }
  
  return result;
};

/**
 * Request manual verification for content
 * @param {String} contentId - Content ID 
 * @param {String} contentType - Type of content
 * @param {String} userId - User ID who requested verification
 * @returns {Promise} - Promise that resolves when request is logged
 */
const requestManualVerification = async (contentId, contentType, userId) => {
  try {
    // In a real app, this would create a verification request in the database
    logger.info(`Manual verification requested for ${contentType} ${contentId} by user ${userId}`);
    
    // Placeholder implementation - would be replaced with DB operation
    return {
      status: 'pending',
      requestId: `verify_${Date.now()}_${contentId}`,
      message: 'Your content has been submitted for manual verification. We will notify you once reviewed.'
    };
  } catch (error) {
    logger.error(`Failed to request manual verification: ${error.message}`);
    throw new Error('Failed to request manual verification');
  }
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
    const response = await fetch(`${ML_API_BASE_URL}/api/ml/user/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    logger.info(`User interaction tracking raw response: ${responseText}`);
    return JSON.parse(responseText);
  });
};

/**
 * Get personalized content recommendations for user
 * @param {String} userId - User ID
 * @param {Object} user - User profile data
 * @param {Number} count - Number of recommendations to return
 * @returns {Promise} - Promise that resolves with recommendations
 */
const getPersonalizedRecommendations = async (userId, user, count = 10) => {
  try {
    logger.info(`Getting recommendations for user: ${userId}`);
    
    // Extract user interests from profile
    const interests = extractUserInterests(user);
    
    // Get top recommendations based on interests
    const recommendations = await fetchRecommendedContent(interests, count);
    
    return {
      userId,
      recommendations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Failed to get recommendations: ${error.message}`);
    throw error;
  }
};

/**
 * Extract user interests from profile data
 * @param {Object} user - User profile data
 * @returns {Array} - Array of interest keywords
 */
const extractUserInterests = (user) => {
  const interests = [];
  
  // Extract from explicit interests if available
  if (user.interests && Array.isArray(user.interests) && user.interests.length > 0) {
    interests.push(...user.interests);
  }
  
  // Extract from tech skills if available
  if (user.techSkills && Array.isArray(user.techSkills) && user.techSkills.length > 0) {
    interests.push(...user.techSkills);
  }
  
  // Extract from bio using keyword analysis if no explicit interests
  if (interests.length === 0 && user.bio) {
    const techKeywords = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node', 'express',
      'data science', 'machine learning', 'ai', 'devops', 'cloud', 'aws', 'azure',
      'docker', 'kubernetes', 'web development', 'mobile', 'android', 'ios', 'flutter',
      'cybersecurity', 'blockchain', 'database', 'sql', 'nosql', 'frontend', 'backend'
    ];
    
    const bioText = user.bio.toLowerCase();
    const foundKeywords = techKeywords.filter(keyword => bioText.includes(keyword.toLowerCase()));
    
    if (foundKeywords.length > 0) {
      interests.push(...foundKeywords);
    } else {
      // Default interests if nothing found
      interests.push('tech tutorials', 'programming', 'software development');
    }
  }
  
  // Default interests if nothing found
  if (interests.length === 0) {
    interests.push('tech tutorials', 'programming', 'software development');
  }
  
  // Remove duplicates and return
  return [...new Set(interests)];
};

/**
 * Fetch recommended content from YouTube based on interests
 * @param {Array} interests - User interest keywords
 * @param {Number} count - Number of recommendations to return
 * @returns {Promise} - Promise that resolves with recommendations
 */
const fetchRecommendedContent = async (interests, count) => {
  try {
    // Build search query from user interests (take up to 3 random interests)
    const randomInterests = interests.sort(() => 0.5 - Math.random()).slice(0, 3);
    const searchTerm = randomInterests.join(' ');
    
    // Call YouTube API
    const youtubeResponse = await youtubeClient.get('/search', {
      params: {
        part: 'snippet',
        q: `${searchTerm} tech tutorial`,
        type: 'video',
        maxResults: count,
        relevanceLanguage: 'en',
        videoDuration: 'medium',
        videoEmbeddable: true
      }
    });
    
    // Transform YouTube response to our recommendation format
    return youtubeResponse.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      source: 'youtube',
      category: detectCategory(item.snippet.title + ' ' + item.snippet.description)
    }));
  } catch (error) {
    logger.error(`YouTube API error: ${error.message}`);
    
    // Fallback to predefined recommendations if API fails
    return getFallbackRecommendations(count);
  }
};

/**
 * Detect tech category from content
 * @param {String} text - Content text
 * @returns {String} - Detected category
 */
const detectCategory = (text) => {
  const lowerText = text.toLowerCase();
  const categoryPatterns = {
    'web_development': ['javascript', 'html', 'css', 'web', 'react', 'angular', 'vue'],
    'data_science': ['data science', 'machine learning', 'ai', 'python', 'tensorflow', 'statistics'],
    'mobile_development': ['android', 'ios', 'flutter', 'react native', 'mobile app'],
    'devops': ['devops', 'docker', 'kubernetes', 'aws', 'azure', 'cloud', 'ci/cd'],
    'cybersecurity': ['security', 'hacking', 'encryption', 'firewall', 'vulnerability']
  };
  
  // Find category with most matches
  let bestCategory = 'general_tech';
  let maxMatches = 0;
  
  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    const matches = patterns.filter(pattern => lowerText.includes(pattern)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }
  
  return bestCategory;
};

/**
 * Get fallback recommendations if API fails
 * @param {Number} count - Number of recommendations to return
 * @returns {Array} - Array of recommendation objects
 */
const getFallbackRecommendations = (count) => {
  const fallbackRecommendations = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Learn Modern JavaScript in 1 Hour',
      description: 'Quick tutorial covering all essential JavaScript concepts for modern web development.',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      publishedAt: '2023-01-15T00:00:00Z',
      channelTitle: 'Tech Learning',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      source: 'youtube',
      category: 'web_development'
    },
    {
      id: 'oVr6unKZbg4',
      title: 'Python Data Science Full Course',
      description: 'Learn Python for data science and machine learning with hands-on examples.',
      thumbnailUrl: 'https://img.youtube.com/vi/oVr6unKZbg4/hqdefault.jpg',
      publishedAt: '2023-02-20T00:00:00Z',
      channelTitle: 'Data Science Pro',
      videoUrl: 'https://www.youtube.com/watch?v=oVr6unKZbg4',
      embedUrl: 'https://www.youtube.com/embed/oVr6unKZbg4',
      source: 'youtube',
      category: 'data_science'
    },
    {
      id: 'gNGm3pI7i0Q',
      title: 'Docker and Kubernetes Tutorial',
      description: 'Complete guide to containerization and orchestration for DevOps engineers.',
      thumbnailUrl: 'https://img.youtube.com/vi/gNGm3pI7i0Q/hqdefault.jpg',
      publishedAt: '2023-03-10T00:00:00Z',
      channelTitle: 'DevOps Master',
      videoUrl: 'https://www.youtube.com/watch?v=gNGm3pI7i0Q',
      embedUrl: 'https://www.youtube.com/embed/gNGm3pI7i0Q',
      source: 'youtube',
      category: 'devops'
    }
  ];
  
  // Add more fallback recommendations if needed
  return fallbackRecommendations.slice(0, count);
};

/**
 * Get personalized recommendations for a user based on preferences
 * @param {String} userId - User ID
 * @param {Object} user - User object with preferences
 * @param {Number} count - Number of recommendations to return
 * @returns {Promise} - Promise that resolves with recommendations
 */
const getRecommendations = async (userId, user, count = 10) => {
  // Call the new implementation
  return getPersonalizedRecommendations(userId, user, count);
};

/**
 * Get all tech categories supported by the ML API
 * @returns {Promise<Array>} - Promise that resolves with list of categories
 */
const getTechCategories = async () => {
  return withRetry(async () => {
    const response = await fetch(`${ML_API_BASE_URL}/api/ml/categories`);
    const responseText = await response.text();
    logger.info(`Tech categories raw response: ${responseText}`);
    return JSON.parse(responseText).categories;
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
    const response = await fetch(`${ML_API_BASE_URL}/api/ml/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    logger.info(`Text classification raw response: ${responseText}`);
    return JSON.parse(responseText);
  });
};

module.exports = {
  verifyContent,
  getPersonalizedRecommendations,
  trackUserInteraction,
  getRecommendations,
  getTechCategories,
  classifyText,
  requestManualVerification
};
