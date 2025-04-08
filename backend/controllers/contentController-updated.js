/**
 * IMPORTANT: This is an updated version of the contentController.js file
 * with fixes for the ML API integration.
 * 
 * To use this file, either:
 * 1. Rename this file to contentController.js (after backing up the original)
 * 2. Or copy the relevant sections to your existing contentController.js
 */

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

// ML API URL for content verification - updated to use the correct URL
const ML_API_URL = process.env.ML_API_URL || 'https://fastapi-app-9b98.onrender.com';

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
      // FIXED: Updated to use the correct API format
      console.log('Sending data to ML API:', { title, description: content.substring(0, 100) + '...' });
      
      const response = await axios.post(`${ML_API_URL}/predict_tech/`, {
        title: title,
        description: content
      });

      console.log('ML API Response:', response.data);
      
      // FIXED: Map the API response to our internal format
      const isTechRelated = response.data.result === 'Technical-related';
      
      verificationResult = {
        is_tech_related: isTechRelated,
        confidence: isTechRelated ? 0.8 : 0.2, // Simplified confidence
        passes_threshold: isTechRelated
      };
      
      console.log('Mapped verification result:', verificationResult);
    } catch (error) {
      console.error('ML API verification error:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      
      // If ML API fails, set verification status to pending
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
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// IMPORTANT: Copy your other controller functions from the original file
// This file only includes the updated uploadArticle function for brevity
