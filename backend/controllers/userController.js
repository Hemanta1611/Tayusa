const { validationResult } = require('express-validator');
const User = require('../models/User');
const Video = require('../models/Video');
const ShortVideo = require('../models/ShortVideo');
const Article = require('../models/Article');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const updateFields = {};

    // Check which fields to update
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.interests) updateFields.interests = req.body.interests;

    // Handle profile picture update if file is provided
    if (req.file) {
      updateFields.profilePicture = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is deleting their own account or if admin is deleting
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
exports.followUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }

    // Add to following and followers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself'
      });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }

    // Remove from following and followers
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get saved content
// @route   GET /api/users/saved
// @access  Private
exports.getSavedContent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Create array to hold fully populated saved content
    const savedContent = [];
    
    // Populate saved content with actual content documents
    for (const item of user.savedContent) {
      let content;
      
      if (item.contentType === 'video') {
        content = await Video.findById(item.contentId)
          .populate('user', 'username profilePicture');
      } else if (item.contentType === 'shortVideo') {
        content = await ShortVideo.findById(item.contentId)
          .populate('user', 'username profilePicture');
      } else if (item.contentType === 'article') {
        content = await Article.findById(item.contentId)
          .populate('user', 'username profilePicture');
      }
      
      if (content) {
        savedContent.push({
          type: item.contentType,
          content
        });
      }
    }

    res.status(200).json({
      success: true,
      count: savedContent.length,
      data: savedContent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save content
// @route   PUT /api/users/saved
// @access  Private
exports.saveContent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { contentType, contentId } = req.body;
    
    // Verify content exists
    let content;
    if (contentType === 'video') {
      content = await Video.findById(contentId);
    } else if (contentType === 'shortVideo') {
      content = await ShortVideo.findById(contentId);
    } else if (contentType === 'article') {
      content = await Article.findById(contentId);
    }
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Check if already saved
    const user = await User.findById(req.user.id);
    const isAlreadySaved = user.savedContent.some(
      item => item.contentId.toString() === contentId && item.contentType === contentType
    );
    
    if (isAlreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'Content already saved'
      });
    }
    
    // Add to saved content
    await User.findByIdAndUpdate(req.user.id, {
      $push: { savedContent: { contentType, contentId } }
    });
    
    res.status(200).json({
      success: true,
      message: 'Content saved successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove saved content
// @route   DELETE /api/users/saved/:contentType/:contentId
// @access  Private
exports.removeSavedContent = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    
    // Check if content is saved
    const user = await User.findById(req.user.id);
    const isSaved = user.savedContent.some(
      item => item.contentId.toString() === contentId && item.contentType === contentType
    );
    
    if (!isSaved) {
      return res.status(400).json({
        success: false,
        message: 'Content not saved'
      });
    }
    
    // Remove from saved content
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedContent: { contentType, contentId } }
    });
    
    res.status(200).json({
      success: true,
      message: 'Content removed from saved successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get my uploaded content
// @route   GET /api/users/uploads/me
// @access  Private
exports.getMyUploads = async (req, res) => {
  try {
    // Get all content uploaded by current user
    const videos = await Video.find({ user: req.user.id });
    const shortVideos = await ShortVideo.find({ user: req.user.id });
    const articles = await Article.find({ user: req.user.id });
    
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
