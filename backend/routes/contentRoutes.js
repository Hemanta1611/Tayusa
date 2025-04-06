const express = require('express');
const path = require('path');
const { body } = require('express-validator');
const multer = require('multer');
const { 
  uploadVideo,
  uploadShortVideo,
  uploadArticle,
  getAllVideos,
  getAllShortVideos,
  getAllArticles,
  getVideoById,
  getShortVideoById,
  getArticleById,
  updateVideo,
  updateShortVideo,
  updateArticle,
  deleteVideo,
  deleteShortVideo,
  deleteArticle,
  likeContent,
  unlikeContent,
  addComment,
  getComments,
  deleteComment,
  likeComment,
  getRecommendedContent,
  getFollowingContent,
  getPopularContent,
  searchContent,
  reportContent
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../shared/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept videos and images
  if (
    file.mimetype === 'video/mp4' || 
    file.mimetype === 'video/quicktime' || 
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Video routes
router.post(
  '/videos', 
  protect, 
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  [
    body('title').isLength({ min: 3, max: 100 }),
    body('description').isLength({ min: 10, max: 2000 }),
    body('techTags').isArray({ min: 1 })
  ],
  uploadVideo
);

router.get('/videos', getAllVideos);
router.get('/videos/:id', getVideoById);

router.put(
  '/videos/:id', 
  protect, 
  [
    body('title').optional().isLength({ min: 3, max: 100 }),
    body('description').optional().isLength({ min: 10, max: 2000 }),
    body('techTags').optional().isArray({ min: 1 })
  ],
  updateVideo
);

router.delete('/videos/:id', protect, deleteVideo);

// Short Video routes
router.post(
  '/shorts', 
  protect, 
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  [
    body('title').isLength({ min: 3, max: 50 }),
    body('description').optional().isLength({ max: 500 }),
    body('techTags').isArray({ min: 1 })
  ],
  uploadShortVideo
);

router.get('/shorts', getAllShortVideos);
router.get('/shorts/:id', getShortVideoById);

router.put(
  '/shorts/:id', 
  protect, 
  [
    body('title').optional().isLength({ min: 3, max: 50 }),
    body('description').optional().isLength({ max: 500 }),
    body('techTags').optional().isArray({ min: 1 })
  ],
  updateShortVideo
);

router.delete('/shorts/:id', protect, deleteShortVideo);

// Article routes
router.post(
  '/articles', 
  protect, 
  upload.single('coverImage'),
  [
    body('title').isLength({ min: 3, max: 100 }),
    body('content').isLength({ min: 100 }),
    body('techTags').isArray({ min: 1 }),
    body('readTime').isNumeric()
  ],
  uploadArticle
);

router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);

router.put(
  '/articles/:id', 
  protect, 
  [
    body('title').optional().isLength({ min: 3, max: 100 }),
    body('content').optional().isLength({ min: 100 }),
    body('techTags').optional().isArray({ min: 1 }),
    body('readTime').optional().isNumeric()
  ],
  updateArticle
);

router.delete('/articles/:id', protect, deleteArticle);

// Interaction routes
router.put('/:type/:id/like', protect, likeContent);
router.put('/:type/:id/unlike', protect, unlikeContent);

// Comment routes
router.post(
  '/:type/:id/comments', 
  protect, 
  [
    body('content').isLength({ min: 1, max: 500 }),
    body('parentComment').optional().isMongoId()
  ],
  addComment
);

router.get('/:type/:id/comments', getComments);
router.delete('/comments/:id', protect, deleteComment);
router.put('/comments/:id/like', protect, likeComment);

// Content discovery routes
router.get('/recommended', protect, getRecommendedContent);
router.get('/following', protect, getFollowingContent);
router.get('/popular', getPopularContent);
router.get('/search', searchContent);

// Report content
router.post(
  '/:type/:id/report', 
  protect, 
  [
    body('reason').isLength({ min: 3, max: 500 }),
    body('category').isIn(['inappropriate', 'spam', 'copyright', 'other'])
  ],
  reportContent
);

module.exports = router;
