import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/apiService';
import { toast } from 'react-toastify';

// Create auth context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // Check for stored authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Try to get current user with stored token
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid token/user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setInitialCheckComplete(true);
      }
    };

    checkAuth();
  }, []);

  // Handle login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user, token } = await authService.login(credentials);
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const register = async (userData) => {
    setLoading(true);
    try {
      const { user, token } = await authService.register(userData);
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = () => {
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    toast.info('You have been logged out.');
  };

  // Update user profile in context
  const updateUserData = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      ...userData
    }));
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    initialCheckComplete,
    login,
    register,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
