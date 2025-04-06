import React, { Component } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to a service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
    
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    // If there's no error, render children normally
    if (!hasError) {
      return children;
    }

    // If a custom fallback is provided, use it
    if (fallback) {
      return fallback(error, errorInfo, this.handleReload);
    }

    // Default error UI
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 mx-auto">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          
          <h2 className="mb-4 text-xl font-bold text-center text-gray-900">
            Something went wrong
          </h2>
          
          <p className="mb-6 text-center text-gray-600">
            We're sorry, but an error occurred while rendering this page.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-gray-100 rounded-md overflow-auto text-sm">
              <p className="font-bold text-red-500">{error.toString()}</p>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="font-medium text-gray-700 cursor-pointer">
                    Component Stack
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-gray-600">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaRedo className="mr-2" /> Reload Page
            </button>
            
            <button
              onClick={this.handleGoHome}
              className="flex items-center justify-center py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <FaHome className="mr-2" /> Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
