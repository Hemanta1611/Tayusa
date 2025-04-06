/**
 * Global error handling utilities for the frontend
 * Provides consistent error handling across the application
 */

import { toast } from 'react-toastify';

// Error types for categorization
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  SERVER: 'SERVER',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Maps HTTP status codes to error types
 * @param {number} status - HTTP status code
 * @returns {string} - Error type
 */
export const getErrorTypeFromStatus = (status) => {
  if (!status) return ERROR_TYPES.NETWORK;
  
  if (status === 401 || status === 403) return ERROR_TYPES.AUTH;
  if (status === 404) return ERROR_TYPES.NOT_FOUND;
  if (status === 422 || status === 400) return ERROR_TYPES.VALIDATION;
  if (status >= 500) return ERROR_TYPES.SERVER;
  
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message based on error type and context
 * @param {string} errorType - Type of error
 * @param {object} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = (errorType, error) => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Network error. Please check your internet connection and try again.';
    
    case ERROR_TYPES.AUTH:
      if (error?.response?.status === 401) {
        return 'Your session has expired. Please log in again.';
      }
      return 'You don\'t have permission to perform this action.';
    
    case ERROR_TYPES.NOT_FOUND:
      return 'The requested resource was not found.';
    
    case ERROR_TYPES.VALIDATION:
      // Try to extract validation messages from response
      try {
        const data = error?.response?.data;
        if (data?.message) return data.message;
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0];
          return typeof firstError === 'string' ? firstError : firstError[0];
        }
      } catch (e) {
        // If extraction fails, use generic message
      }
      return 'Please check your input and try again.';
    
    case ERROR_TYPES.SERVER:
      return 'Server error. Please try again later.';
    
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Handle API error globally
 * @param {object} error - Error object from API request
 * @param {string} context - Context of the error for logging
 * @param {Function} onError - Optional callback for custom error handling
 * @returns {object} - Processed error with type and message
 */
export const handleApiError = (error, context = 'API', onError = null) => {
  console.error(`Error in ${context}:`, error);
  
  // Get status code and error type
  const status = error?.response?.status;
  const errorType = getErrorTypeFromStatus(status);
  
  // Get user-friendly message
  const message = getUserFriendlyErrorMessage(errorType, error);
  
  // Show toast notification
  toast.error(message);
  
  // Call custom error handler if provided
  if (onError && typeof onError === 'function') {
    onError(errorType, message, error);
  }
  
  // Return processed error
  return {
    type: errorType,
    message,
    originalError: error,
    status
  };
};

/**
 * Error boundary fallback UI function
 * @param {object} error - Error object
 * @param {object} errorInfo - React error info
 * @param {Function} resetErrorBoundary - Function to reset error boundary
 * @returns {React.ReactNode} - Fallback UI
 */
export const fallbackRender = (error, errorInfo, resetErrorBoundary) => {
  // Log error
  console.error('Error caught by fallback:', error, errorInfo);
  
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto my-8">
      <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-4">
        We're sorry, but an error occurred. Please try again.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export default {
  handleApiError,
  fallbackRender,
  ERROR_TYPES,
  getErrorTypeFromStatus,
  getUserFriendlyErrorMessage
};
