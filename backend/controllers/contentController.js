const { validationResult } = require('express-validator');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const ShortVideo = require('../models/ShortVideo');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const User = require('../models/User');

// ML API URL for content verification
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

// @desc    Upload a video
// @route   POST /api/content/videos
// @access  Private
exports.uploadVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Please upload both video and thumbnail files'
      });
    }

    const { title, description, techTags } = req.body;
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Verify if content is tech-related using ML API
    let verificationResult;
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(videoFile.path));
      formData.append('title', title);
      formData.append('description', description);

      const response = await axios.post(`${ML_API_URL}/api/ml/analyze/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      verificationResult = response.data;
    } catch (error) {
      console.error('ML API verification error:', error);
      // If ML API fails, set verification status to pending
      verificationResult = {
        is_tech_related: false,
        confidence: 0,
        passes_threshold: false
      };
    }

    // Create the video record
    const video = await Video.create({
      title,
      description,
      user: req.user.id,
      videoUrl: videoFile.filename,
      thumbnailUrl: thumbnailFile.filename,
      duration: req.body.duration || 0, // This would ideally be extracted from the video
      techTags: Array.isArray(techTags) ? techTags : [techTags],
      verified: verificationResult.passes_threshold,
      verificationStatus: verificationResult.passes_threshold ? 'approved' : 'pending',
      transcript: verificationResult.transcript || ''
    });

    res.status(201).json({
      success: true,
      data: video,
      verification: verificationResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload a short video
// @route   POST /api/content/shorts
// @access  Private
exports.uploadShortVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Please upload both video and thumbnail files'
      });
    }

    const { title, description, techTags } = req.body;
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Verify if content is tech-related using ML API (similar to uploadVideo)
    let verificationResult;
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(videoFile.path));
      formData.append('title', title);
      formData.append('description', description);

      const response = await axios.post(`${ML_API_URL}/api/ml/analyze/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      verificationResult = response.data;
    } catch (error) {
      console.error('ML API verification error:', error);
      verificationResult = {
        is_tech_related: false,
        confidence: 0,
        passes_threshold: false
      };
    }

    // Create the short video record
    const shortVideo = await ShortVideo.create({
      title,
      description,
      user: req.user.id,
      videoUrl: videoFile.filename,
      thumbnailUrl: thumbnailFile.filename,
      duration: req.body.duration || 0,
      techTags: Array.isArray(techTags) ? techTags : [techTags],
      verified: verificationResult.passes_threshold,
      verificationStatus: verificationResult.passes_threshold ? 'approved' : 'pending',
      transcript: verificationResult.transcript || ''
    });

    res.status(201).json({
      success: true,
      data: shortVideo,
      verification: verificationResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload an article
// @route   POST /api/content/articles
// @access  Private
exports.uploadArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, content, techTags, readTime } = req.body;
    
    // Get cover image if uploaded
    const coverImageUrl = req.file ? req.file.filename : null;

    // Verify if content is tech-related using ML API
    let verificationResult;
    try {
      const response = await axios.post(`${ML_API_URL}/api/ml/analyze/article`, {
        title,
        content
      });

      verificationResult = response.data;
    } catch (error) {
      console.error('ML API verification error:', error);
      verificationResult = {
        is_tech_related: false,
        confidence: 0,
        passes_threshold: false
      };
    }

    // Create the article record
    const article = await Article.create({
      title,
      content,
      user: req.user.id,
      coverImageUrl,
      readTime,
      techTags: Array.isArray(techTags) ? techTags : [techTags],
      verified: verificationResult.passes_threshold,
      verificationStatus: verificationResult.passes_threshold ? 'approved' : 'pending'
    });

    res.status(201).json({
      success: true,
      data: article,
      verification: verificationResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all videos
// @route   GET /api/content/videos
// @access  Public
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Only return verified public videos
    const query = {
      verified: true,
      isPublic: true
    };
    
    // Filter by tech tags if provided
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.techTags = { $in: tags };
    }
    
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'username profilePicture');
    
    const totalVideos = await Video.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: videos.length,
      totalPages: Math.ceil(totalVideos / limit),
      currentPage: page,
      data: videos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all short videos
// @route   GET /api/content/shorts
// @access  Public
exports.getAllShortVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Only return verified public short videos
    const query = {
      verified: true,
      isPublic: true
    };
    
    // Filter by tech tags if provided
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.techTags = { $in: tags };
    }
    
    const shortVideos = await ShortVideo.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'username profilePicture');
    
    const totalShortVideos = await ShortVideo.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: shortVideos.length,
      totalPages: Math.ceil(totalShortVideos / limit),
      currentPage: page,
      data: shortVideos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all articles
// @route   GET /api/content/articles
// @access  Public
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Only return verified public articles
    const query = {
      verified: true,
      isPublic: true
    };
    
    // Filter by tech tags if provided
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.techTags = { $in: tags };
    }
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'username profilePicture');
    
    const totalArticles = await Article.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: articles.length,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
      data: articles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
