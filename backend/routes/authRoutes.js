const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post(
  '/register', 
  [
    body('username').isLength({ min: 3, max: 20 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty()
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  login
);

// Logout user
router.get('/logout', logout);

// Get current logged in user
router.get('/me', protect, getMe);

// Forgot password
router.post(
  '/forgotpassword',
  [
    body('email').isEmail().normalizeEmail()
  ],
  forgotPassword
);

// Reset password
router.put(
  '/resetpassword/:resetToken',
  [
    body('password').isLength({ min: 6 })
  ],
  resetPassword
);

// Update password
router.put(
  '/updatepassword',
  protect,
  [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 })
  ],
  updatePassword
);

module.exports = router;
