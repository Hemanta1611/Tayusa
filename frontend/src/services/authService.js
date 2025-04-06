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

// Add response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const refreshResponse = await API.post('/auth/refresh');
        const { token } = refreshResponse.data;
        
        // Update token in local storage
        localStorage.setItem('token', token);
        
        // Update Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, log the user out
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration response
 */
const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Log in a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} Promise with login response
 */
const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Log out the current user
 * @returns {Promise} Promise indicating logout success
 */
const logout = async () => {
  try {
    await API.get('/auth/logout');
    localStorage.removeItem('token');
    return { success: true };
  } catch (error) {
    localStorage.removeItem('token');
    throw error.response?.data || { message: 'Logout failed' };
  }
};

/**
 * Get the current user's profile
 * @returns {Promise} Promise with the user data
 */
const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user data' };
  }
};

/**
 * Check if the user is logged in
 * @returns {Boolean} True if the user is logged in
 */
const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * Request a password reset
 * @param {string} email - The user's email address
 * @returns {Promise} Promise with the reset response
 */
const forgotPassword = async (email) => {
  try {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request password reset' };
  }
};

/**
 * Reset a user's password
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise} Promise with the reset response
 */
const resetPassword = async (token, password) => {
  try {
    const response = await API.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

/**
 * Update the current user's profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise with the updated user data
 */
const updateProfile = async (userData) => {
  try {
    const response = await API.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Change the current user's password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise} Promise with the response
 */
const changePassword = async (passwordData) => {
  try {
    const response = await API.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
};

export default authService;
