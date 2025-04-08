/**
 * API Helper Utility
 * Provides standalone functions for making authenticated API requests
 */

// Get the authentication token from all possible sources
const getAuthToken = () => {
  // Try localStorage first (most common)
  const localToken = localStorage.getItem('token');
  if (localToken) return localToken;
  
  // Try sessionStorage
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) return sessionToken;
  
  // Try to extract from cookies
  const cookieString = document.cookie;
  const tokenCookie = cookieString.split(';').find(cookie => cookie.trim().startsWith('token='));
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  // If no token found
  console.warn('No authentication token found in storage or cookies');
  return null;
};

// Direct article upload without Redux
export const uploadArticleDirectly = async (formData) => {
  try {
    console.log('Starting direct article upload via helper...');
    
    // Create FormData with precisely what the backend expects
    const articleData = new FormData();
    articleData.append('title', formData.title);
    articleData.append('content', formData.content);
    articleData.append('readTime', parseInt(formData.readTime || '5', 10));
    
    // Format techTags as array elements with the correct field name format
    const tags = formData.techTags?.split(',').map(tag => tag.trim()).filter(Boolean) || ['general'];
    tags.forEach(tag => {
      articleData.append('techTags[]', tag);
    });
    
    // Cover image with backend-expected field name
    if (formData.coverImageFile) {
      articleData.append('coverImage', formData.coverImageFile);
    }
    
    // Get token and log its presence/absence
    const token = getAuthToken();
    console.log('Token available:', !!token);
    
    // Log request details
    console.log('- URL: /api/content/articles');
    console.log('- FormData keys:', [...articleData.keys()]);
    
    // Make the request with proper credentials and authorization
    const response = await fetch('/api/content/articles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || ''}`
      },
      credentials: 'include', // Include cookies in case the token is also stored as a cookie
      body: articleData
    });
    
    // Log response details
    console.log('Response status:', response.status);
    
    // Parse response
    let responseData;
    try {
      const text = await response.text();
      console.log('Raw response:', text);
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        console.log('Response is not valid JSON');
      }
    } catch (e) {
      console.log('Error reading response body');
    }
    
    // Return standardized response object
    return {
      success: response.ok,
      status: response.status,
      data: responseData,
      error: response.ok ? null : (responseData?.message || `Failed with status ${response.status}`)
    };
  } catch (error) {
    console.error('Critical error in uploadArticleDirectly:', error);
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message
    };
  }
};

// Simple function to check authentication status
export const checkAuth = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return { authenticated: false, message: 'No token found' };
    }
    
    // Try a simple GET request to verify the token
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      const userData = await response.json();
      return { 
        authenticated: true, 
        user: userData.data || userData,
        message: 'Authentication successful' 
      };
    } else {
      return { 
        authenticated: false, 
        status: response.status,
        message: `Authentication failed with status ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      authenticated: false, 
      message: `Error checking authentication: ${error.message}` 
    };
  }
};

export default {
  getAuthToken,
  uploadArticleDirectly,
  checkAuth
};
