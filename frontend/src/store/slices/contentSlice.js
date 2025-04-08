import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { isTechRelated } from '../../utils/techValidation';
import { searchYouTube } from '../../utils/youtubeService';

// Get all videos
export const getVideos = createAsyncThunk(
  'content/getVideos',
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, tags } = params || {};
      let url = `/api/content/videos?page=${page}&limit=${limit}`;
      
      if (tags) {
        url += `&tags=${tags}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get all short videos
export const getShortVideos = createAsyncThunk(
  'content/getShortVideos',
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, tags } = params || {};
      let url = `/api/content/shorts?page=${page}&limit=${limit}`;
      
      if (tags) {
        url += `&tags=${tags}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get all articles
export const getArticles = createAsyncThunk(
  'content/getArticles',
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, tags } = params || {};
      let url = `/api/content/articles?page=${page}&limit=${limit}`;
      
      if (tags) {
        url += `&tags=${tags}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Search content
export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (query, { rejectWithValue, dispatch }) => {
    try {
      // First check if the query is tech-related
      if (!isTechRelated(query)) {
        return {
          data: [],
          isNonTech: true,
          message: 'Non-tech content is not available on this platform.'
        };
      }
      
      // Search local database first
      const response = await axios.get(`/api/content/search?q=${encodeURIComponent(query)}`);
      
      // If no results found in local database, search YouTube instead of dispatching
      if (response.data.data.length === 0) {
        try {
          const youtubeResults = await searchYouTube(query);
          return {
            data: youtubeResults,
            source: 'youtube'
          };
        } catch (youtubeError) {
          console.error('YouTube search error:', youtubeError);
          // Return empty results if YouTube search fails
          return response.data;
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      const message = error.response?.data?.message || error.message;
      
      // If there's an error with local search, try YouTube directly
      try {
        const youtubeResults = await searchYouTube(query);
        return {
          data: youtubeResults,
          source: 'youtube'
        };
      } catch (youtubeError) {
        console.error('YouTube fallback search error:', youtubeError);
        return rejectWithValue(message);
      }
    }
  }
);

// Search YouTube content
export const searchYouTubeContent = createAsyncThunk(
  'content/searchYouTubeContent',
  async (query, { rejectWithValue }) => {
    try {
      // Use the real YouTube API service
      const youtubeResults = await searchYouTube(query);
      
      return {
        data: youtubeResults,
        source: 'youtube'
      };
    } catch (error) {
      const message = error.message || 'Failed to fetch YouTube results';
      return rejectWithValue(message);
    }
  }
);

// Upload a video
export const uploadVideo = createAsyncThunk(
  'content/uploadVideo',
  async (videoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      };
      
      const response = await axios.post('/api/content/videos', videoData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Upload a short video
export const uploadShortVideo = createAsyncThunk(
  'content/uploadShortVideo',
  async (videoData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      };
      
      const response = await axios.post('/api/content/shorts', videoData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Upload an article
export const uploadArticle = createAsyncThunk(
  'content/uploadArticle',
  async (articleData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      };
      
      const response = await axios.post('/api/content/articles', articleData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  videos: {
    items: [],
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null
  },
  shortVideos: {
    items: [],
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null
  },
  articles: {
    items: [],
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null
  },
  searchResults: [],
  loading: false,
  error: null,
  uploadStatus: {
    loading: false,
    success: false,
    error: null
  }
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    resetUploadStatus: (state) => {
      state.uploadStatus = {
        loading: false,
        success: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get videos
      .addCase(getVideos.pending, (state) => {
        state.videos.loading = true;
        state.videos.error = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.videos.loading = false;
        state.videos.items = action.payload.data;
        state.videos.totalPages = action.payload.totalPages;
        state.videos.currentPage = action.payload.currentPage;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.videos.loading = false;
        state.videos.error = action.payload;
      })
      
      // Get short videos
      .addCase(getShortVideos.pending, (state) => {
        state.shortVideos.loading = true;
        state.shortVideos.error = null;
      })
      .addCase(getShortVideos.fulfilled, (state, action) => {
        state.shortVideos.loading = false;
        state.shortVideos.items = action.payload.data;
        state.shortVideos.totalPages = action.payload.totalPages;
        state.shortVideos.currentPage = action.payload.currentPage;
      })
      .addCase(getShortVideos.rejected, (state, action) => {
        state.shortVideos.loading = false;
        state.shortVideos.error = action.payload;
      })
      
      // Get articles
      .addCase(getArticles.pending, (state) => {
        state.articles.loading = true;
        state.articles.error = null;
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.articles.loading = false;
        state.articles.items = action.payload.data;
        state.articles.totalPages = action.payload.totalPages;
        state.articles.currentPage = action.payload.currentPage;
      })
      .addCase(getArticles.rejected, (state, action) => {
        state.articles.loading = false;
        state.articles.error = action.payload;
      })
      
      // Search content
      .addCase(searchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search YouTube content
      .addCase(searchYouTubeContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchYouTubeContent.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchYouTubeContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload content (video, short video, article)
      .addCase(uploadVideo.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.error = null;
        state.uploadStatus.success = false;
      })
      .addCase(uploadVideo.fulfilled, (state) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload;
      })
      
      .addCase(uploadShortVideo.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.error = null;
        state.uploadStatus.success = false;
      })
      .addCase(uploadShortVideo.fulfilled, (state) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
      })
      .addCase(uploadShortVideo.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload;
      })
      
      .addCase(uploadArticle.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.error = null;
        state.uploadStatus.success = false;
      })
      .addCase(uploadArticle.fulfilled, (state) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
      })
      .addCase(uploadArticle.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload;
      });
  }
});

export const { resetUploadStatus } = contentSlice.actions;
export default contentSlice.reducer;
