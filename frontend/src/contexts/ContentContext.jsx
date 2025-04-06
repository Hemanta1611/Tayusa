import React, { createContext, useState, useContext, useEffect } from 'react';
import { contentService, mlService } from '../services/apiService';
import { useAuth } from './AuthContext';

// Create content context
const ContentContext = createContext(null);

// Provider component
export const ContentProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // State for different content types
  const [forYouContent, setForYouContent] = useState([]);
  const [followingContent, setFollowingContent] = useState([]);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [savedContent, setSavedContent] = useState([]);
  
  // Loading states
  const [loadingForYou, setLoadingForYou] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    forYou: { page: 1, hasMore: true },
    following: { page: 1, hasMore: true },
    saved: { page: 1, hasMore: true }
  });
  
  // Fetch content for "For You" feed
  const fetchForYouContent = async (page = 1, refresh = false) => {
    if (loadingForYou) return;
    
    // If refresh, reset pagination
    if (refresh) {
      setPagination(prev => ({
        ...prev,
        forYou: { page: 1, hasMore: true }
      }));
    }
    
    // If no more content and not refreshing, return
    if (!pagination.forYou.hasMore && !refresh) return;
    
    setLoadingForYou(true);
    try {
      const response = await contentService.getForYouContent(
        refresh ? 1 : pagination.forYou.page,
        20
      );
      
      // Update content
      if (refresh || page === 1) {
        setForYouContent(response.data);
      } else {
        setForYouContent(prev => [...prev, ...response.data]);
      }
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        forYou: {
          page: refresh ? 2 : prev.forYou.page + 1,
          hasMore: response.data.length === 20
        }
      }));
    } catch (error) {
      console.error('Error fetching For You content:', error);
    } finally {
      setLoadingForYou(false);
    }
  };
  
  // Fetch content from followed users
  const fetchFollowingContent = async (page = 1, refresh = false) => {
    if (loadingFollowing || !isAuthenticated) return;
    
    // If refresh, reset pagination
    if (refresh) {
      setPagination(prev => ({
        ...prev,
        following: { page: 1, hasMore: true }
      }));
    }
    
    // If no more content and not refreshing, return
    if (!pagination.following.hasMore && !refresh) return;
    
    setLoadingFollowing(true);
    try {
      const response = await contentService.getFollowingContent(
        refresh ? 1 : pagination.following.page,
        20
      );
      
      // Update content
      if (refresh || page === 1) {
        setFollowingContent(response.data);
      } else {
        setFollowingContent(prev => [...prev, ...response.data]);
      }
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        following: {
          page: refresh ? 2 : prev.following.page + 1,
          hasMore: response.data.length === 20
        }
      }));
    } catch (error) {
      console.error('Error fetching Following content:', error);
    } finally {
      setLoadingFollowing(false);
    }
  };
  
  // Fetch recommended content
  const fetchRecommendedContent = async (count = 10) => {
    if (loadingRecommended || !isAuthenticated) return;
    
    setLoadingRecommended(true);
    try {
      const recommendations = await mlService.getRecommendations(
        currentUser._id,
        count
      );
      
      setRecommendedContent(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommended(false);
    }
  };
  
  // Fetch saved content
  const fetchSavedContent = async (page = 1, refresh = false) => {
    if (loadingSaved || !isAuthenticated) return;
    
    // If refresh, reset pagination
    if (refresh) {
      setPagination(prev => ({
        ...prev,
        saved: { page: 1, hasMore: true }
      }));
    }
    
    // If no more content and not refreshing, return
    if (!pagination.saved.hasMore && !refresh) return;
    
    setLoadingSaved(true);
    try {
      // We'll use userContent endpoint with the saved type
      const response = await contentService.getUserContent(
        currentUser._id,
        'saved',
        refresh ? 1 : pagination.saved.page,
        20
      );
      
      // Update content
      if (refresh || page === 1) {
        setSavedContent(response.data);
      } else {
        setSavedContent(prev => [...prev, ...response.data]);
      }
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        saved: {
          page: refresh ? 2 : prev.saved.page + 1,
          hasMore: response.data.length === 20
        }
      }));
    } catch (error) {
      console.error('Error fetching saved content:', error);
    } finally {
      setLoadingSaved(false);
    }
  };
  
  // Track user interaction with content
  const trackInteraction = async (content, interactionType) => {
    if (!isAuthenticated) return;
    
    try {
      await mlService.trackInteraction(
        currentUser._id,
        content,
        interactionType
      );
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };
  
  // User actions for content
  const likeContent = async (contentId, contentType) => {
    if (!isAuthenticated) return;
    
    try {
      await contentService.likeContent(contentId, contentType);
      
      // Find and update the content in state
      const updateContentLike = (contentList) => {
        return contentList.map(item => {
          if (item._id === contentId) {
            return {
              ...item,
              liked: true,
              disliked: false,
              likesCount: item.likesCount + 1,
              // If it was previously disliked, reduce the dislike count
              dislikesCount: item.disliked ? item.dislikesCount - 1 : item.dislikesCount
            };
          }
          return item;
        });
      };
      
      setForYouContent(updateContentLike);
      setFollowingContent(updateContentLike);
      setRecommendedContent(updateContentLike);
      setSavedContent(updateContentLike);
      
      // Track interaction
      const content = [...forYouContent, ...followingContent, ...recommendedContent, ...savedContent]
        .find(item => item._id === contentId);
      
      if (content) {
        trackInteraction(content, 'like');
      }
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };
  
  const dislikeContent = async (contentId, contentType) => {
    if (!isAuthenticated) return;
    
    try {
      await contentService.dislikeContent(contentId, contentType);
      
      // Find and update the content in state
      const updateContentDislike = (contentList) => {
        return contentList.map(item => {
          if (item._id === contentId) {
            return {
              ...item,
              liked: false,
              disliked: true,
              dislikesCount: item.dislikesCount + 1,
              // If it was previously liked, reduce the like count
              likesCount: item.liked ? item.likesCount - 1 : item.likesCount
            };
          }
          return item;
        });
      };
      
      setForYouContent(updateContentDislike);
      setFollowingContent(updateContentDislike);
      setRecommendedContent(updateContentDislike);
      setSavedContent(updateContentDislike);
      
      // Track interaction
      const content = [...forYouContent, ...followingContent, ...recommendedContent, ...savedContent]
        .find(item => item._id === contentId);
      
      if (content) {
        trackInteraction(content, 'dislike');
      }
    } catch (error) {
      console.error('Error disliking content:', error);
    }
  };
  
  const saveContent = async (contentId, contentType) => {
    if (!isAuthenticated) return;
    
    try {
      await contentService.saveContent(contentId, contentType);
      
      // Find and update the content in state
      const updateContentSave = (contentList) => {
        return contentList.map(item => {
          if (item._id === contentId) {
            return {
              ...item,
              saved: !item.saved
            };
          }
          return item;
        });
      };
      
      setForYouContent(updateContentSave);
      setFollowingContent(updateContentSave);
      setRecommendedContent(updateContentSave);
      
      // Refresh saved content
      fetchSavedContent(1, true);
      
      // Track interaction
      const content = [...forYouContent, ...followingContent, ...recommendedContent]
        .find(item => item._id === contentId);
      
      if (content) {
        trackInteraction(content, content.saved ? 'unsave' : 'save');
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };
  
  // Load initial content when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchForYouContent();
      fetchFollowingContent();
      fetchRecommendedContent();
    }
  }, [isAuthenticated]);
  
  // Context value
  const value = {
    // Content
    forYouContent,
    followingContent,
    recommendedContent,
    savedContent,
    
    // Loading states
    loadingForYou,
    loadingFollowing,
    loadingRecommended,
    loadingSaved,
    
    // Functions
    fetchForYouContent,
    fetchFollowingContent,
    fetchRecommendedContent,
    fetchSavedContent,
    
    // User actions
    likeContent,
    dislikeContent,
    saveContent,
    trackInteraction
  };
  
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;
