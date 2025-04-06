const express = require('express');
const { body } = require('express-validator');
const { 
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  followUser,
  unfollowUser,
  getSavedContent,
  saveContent,
  removeSavedContent,
  getMyUploads
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user profile
router.put(
  '/profile',
  protect,
  [
    body('name').optional(),
    body('bio').optional().isLength({ max: 250 }),
    body('interests').optional().isArray()
  ],
  updateUserProfile
);

// Delete user (self or admin)
router.delete('/:id', protect, deleteUser);

// Follow a user
router.put('/follow/:id', protect, followUser);

// Unfollow a user
router.put('/unfollow/:id', protect, unfollowUser);

// Get saved content
router.get('/saved', protect, getSavedContent);

// Save content
router.put(
  '/saved',
  protect,
  [
    body('contentType').isIn(['video', 'shortVideo', 'article']),
    body('contentId').isMongoId()
  ],
  saveContent
);

// Remove saved content
router.delete('/saved/:contentType/:contentId', protect, removeSavedContent);

// Get my uploaded content
router.get('/uploads/me', protect, getMyUploads);

module.exports = router;
