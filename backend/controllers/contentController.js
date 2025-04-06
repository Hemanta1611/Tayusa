const { validationResult } = require('express-validator');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
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

// @desc    Get video by ID
// @route   GET /api/content/videos/:id
// @access  Public
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments');
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get short video by ID
// @route   GET /api/content/shorts/:id
// @access  Public
exports.getShortVideoById = async (req, res) => {
  try {
    const shortVideo = await ShortVideo.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments');
    
    if (!shortVideo) {
      return res.status(404).json({
        success: false,
        message: 'Short video not found'
      });
    }
    
    // Increment views
    shortVideo.views += 1;
    await shortVideo.save();
    
    res.status(200).json({
      success: true,
      data: shortVideo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get article by ID
// @route   GET /api/content/articles/:id
// @access  Public
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a video
// @route   PUT /api/content/videos/:id
// @access  Private
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Check user
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Update fields
    const { title, description, techTags, isPublic } = req.body;
    
    if (title) video.title = title;
    if (description) video.description = description;
    if (techTags) video.techTags = techTags;
    if (isPublic !== undefined) video.isPublic = isPublic;
    
    await video.save();
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a short video
// @route   PUT /api/content/shorts/:id
// @access  Private
exports.updateShortVideo = async (req, res) => {
  try {
    const shortVideo = await ShortVideo.findById(req.params.id);
    
    if (!shortVideo) {
      return res.status(404).json({
        success: false,
        message: 'Short video not found'
      });
    }
    
    // Check user
    if (shortVideo.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Update fields
    const { title, description, techTags, isPublic } = req.body;
    
    if (title) shortVideo.title = title;
    if (description) shortVideo.description = description;
    if (techTags) shortVideo.techTags = techTags;
    if (isPublic !== undefined) shortVideo.isPublic = isPublic;
    
    await shortVideo.save();
    
    res.status(200).json({
      success: true,
      data: shortVideo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update an article
// @route   PUT /api/content/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Check user
    if (article.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Update fields
    const { title, content, techTags, readTime, isPublic } = req.body;
    
    if (title) article.title = title;
    if (content) article.content = content;
    if (techTags) article.techTags = techTags;
    if (readTime) article.readTime = readTime;
    if (isPublic !== undefined) article.isPublic = isPublic;
    
    await article.save();
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a video
// @route   DELETE /api/content/videos/:id
// @access  Private
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Check user
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Delete comments
    await Comment.deleteMany({ contentId: video._id });
    
    // Delete the video
    await video.remove();
    
    res.status(200).json({
      success: true,
      message: 'Video deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a short video
// @route   DELETE /api/content/shorts/:id
// @access  Private
exports.deleteShortVideo = async (req, res) => {
  try {
    const shortVideo = await ShortVideo.findById(req.params.id);
    
    if (!shortVideo) {
      return res.status(404).json({
        success: false,
        message: 'Short video not found'
      });
    }
    
    // Check user
    if (shortVideo.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Delete comments
    await Comment.deleteMany({ contentId: shortVideo._id });
    
    // Delete the short video
    await shortVideo.remove();
    
    res.status(200).json({
      success: true,
      message: 'Short video deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete an article
// @route   DELETE /api/content/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Check user
    if (article.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Delete comments
    await Comment.deleteMany({ contentId: article._id });
    
    // Delete the article
    await article.remove();
    
    res.status(200).json({
      success: true,
      message: 'Article deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like content (video, short video, article)
// @route   PUT /api/content/:type/:id/like
// @access  Private
exports.likeContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    let content;
    
    // Get the content based on type
    if (type === 'videos') {
      content = await Video.findById(id);
    } else if (type === 'shorts') {
      content = await ShortVideo.findById(id);
    } else if (type === 'articles') {
      content = await Article.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Check if content already liked
    if (content.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Content already liked'
      });
    }
    
    // Add user to likes array
    content.likes.push(req.user.id);
    await content.save();
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unlike content (video, short video, article)
// @route   PUT /api/content/:type/:id/unlike
// @access  Private
exports.unlikeContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    let content;
    
    // Get the content based on type
    if (type === 'videos') {
      content = await Video.findById(id);
    } else if (type === 'shorts') {
      content = await ShortVideo.findById(id);
    } else if (type === 'articles') {
      content = await Article.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Check if content not liked
    if (!content.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Content not liked yet'
      });
    }
    
    // Remove user from likes array
    content.likes = content.likes.filter(
      like => like.toString() !== req.user.id
    );
    
    await content.save();
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to content
// @route   POST /api/content/:type/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { content, parentComment } = req.body;
    
    // Create the comment
    const comment = await Comment.create({
      user: req.user.id,
      content,
      contentType: type,
      contentId: id,
      parentComment
    });
    
    // Populate user info
    await comment.populate('user', 'username profilePicture');
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get comments for content
// @route   GET /api/content/:type/:id/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Get top-level comments
    const comments = await Comment.find({
      contentType: type,
      contentId: id,
      parentComment: null
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePicture');
    
    // For each comment, get replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id
        })
          .sort({ createdAt: 1 })
          .populate('user', 'username profilePicture');
        
        return {
          ...comment._doc,
          replies
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: commentsWithReplies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/content/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Delete replies if top-level comment
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }
    
    // Delete the comment
    await comment.remove();
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like a comment
// @route   PUT /api/content/comments/:id/like
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if already liked
    if (comment.likes.includes(req.user.id)) {
      // Unlike
      comment.likes = comment.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // Like
      comment.likes.push(req.user.id);
    }
    
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get recommended content
// @route   GET /api/content/recommended
// @access  Private
exports.getRecommendedContent = async (req, res) => {
  try {
    // In a real app, this would use ML to recommend content
    // based on user preferences and behavior
    
    // For now, just return recent content
    const videos = await Video.find({ verified: true, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username profilePicture');
    
    const shortVideos = await ShortVideo.find({ verified: true, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username profilePicture');
    
    const articles = await Article.find({ verified: true, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username profilePicture');
    
    res.status(200).json({
      success: true,
      data: {
        videos,
        shortVideos,
        articles
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get content from followed users
// @route   GET /api/content/following
// @access  Private
exports.getFollowingContent = async (req, res) => {
  try {
    // Get the user with following list
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get content from followed users
    const videos = await Video.find({
      user: { $in: user.following },
      verified: true,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const shortVideos = await ShortVideo.find({
      user: { $in: user.following },
      verified: true,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const articles = await Article.find({
      user: { $in: user.following },
      verified: true,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    res.status(200).json({
      success: true,
      data: {
        videos,
        shortVideos,
        articles
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular content
// @route   GET /api/content/popular
// @access  Public
exports.getPopularContent = async (req, res) => {
  try {
    // Get content with most views and likes
    const videos = await Video.find({ verified: true, isPublic: true })
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const shortVideos = await ShortVideo.find({ verified: true, isPublic: true })
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const articles = await Article.find({ verified: true, isPublic: true })
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    res.status(200).json({
      success: true,
      data: {
        videos,
        shortVideos,
        articles
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search content
// @route   GET /api/content/search
// @access  Public
exports.searchContent = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    // Search in titles and descriptions
    const searchRegex = new RegExp(q, 'i');
    
    const videos = await Video.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { techTags: searchRegex }
      ],
      verified: true,
      isPublic: true
    })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const shortVideos = await ShortVideo.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { techTags: searchRegex }
      ],
      verified: true,
      isPublic: true
    })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    const articles = await Article.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { techTags: searchRegex }
      ],
      verified: true,
      isPublic: true
    })
      .limit(10)
      .populate('user', 'username profilePicture');
    
    res.status(200).json({
      success: true,
      data: {
        videos,
        shortVideos,
        articles
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Report content
// @route   POST /api/content/:type/:id/report
// @access  Private
exports.reportContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason, category } = req.body;
    
    let content;
    
    // Get content based on type
    if (type === 'videos') {
      content = await Video.findById(id);
    } else if (type === 'shorts') {
      content = await ShortVideo.findById(id);
    } else if (type === 'articles') {
      content = await Article.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Add report to content
    content.reports.push({
      user: req.user.id,
      reason,
      category
    });
    
    // If too many reports, change verification status
    if (content.reports.length >= 5) {
      content.verificationStatus = 'flagged';
    }
    
    await content.save();
    
    res.status(200).json({
      success: true,
      message: 'Content reported successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
