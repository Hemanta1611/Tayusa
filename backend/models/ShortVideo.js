const mongoose = require('mongoose');

const ShortVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [50, 'Title cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Please provide a thumbnail URL']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide the video duration in seconds'],
    max: [60, 'Short videos cannot exceed 60 seconds']
  },
  transcript: {
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  techTags: [{
    type: String,
    required: [true, 'Please provide at least one tech tag']
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
ShortVideoSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
ShortVideoSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

module.exports = mongoose.model('ShortVideo', ShortVideoSchema);
