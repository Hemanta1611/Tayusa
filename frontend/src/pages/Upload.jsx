import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo, uploadShortVideo, resetUploadStatus } from '../store/slices/contentSlice';
import { FaVideo, FaFileVideo, FaNewspaper, FaUpload, FaPen, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

function Upload() {
  const [contentType, setContentType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techTags: '',
    videoFile: null,
    thumbnailFile: null,
    coverImageFile: null,
    content: '',
    readTime: 0
  });
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [requestManualVerification, setRequestManualVerification] = useState(false);

  const dispatch = useDispatch();
  const { uploadStatus } = useSelector(state => state.content);
  const { user } = useSelector(state => state.auth);

  // Reset upload status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetUploadStatus());
    };
  }, [dispatch]);

  // Clear form when content type changes
  useEffect(() => {
    if (contentType) {
      setFormData({
        title: '',
        description: '',
        techTags: '',
        videoFile: null,
        thumbnailFile: null,
        coverImageFile: null,
        content: '',
        readTime: 0
      });
      setPreview(null);
      setFormErrors({});
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [contentType]);

  // Generate preview when file is selected
  useEffect(() => {
    if (!formData.thumbnailFile && !formData.coverImageFile) {
      setPreview(null);
      return;
    }

    const file = formData.thumbnailFile || formData.coverImageFile;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.thumbnailFile, formData.coverImageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Clear error when user selects a file
      if (formErrors[name]) {
        setFormErrors({
          ...formErrors,
          [name]: ''
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) {
      errors.title = 'Title is required';
    }
    
    if (!formData.techTags) {
      errors.techTags = 'At least one tech tag is required';
    }
    
    if (contentType === 'video' || contentType === 'shortVideo') {
      if (!formData.videoFile) {
        errors.videoFile = 'Video file is required';
      }
      
      if (!formData.thumbnailFile) {
        errors.thumbnailFile = 'Thumbnail image is required';
      }
      
      if (!formData.description) {
        errors.description = 'Description is required';
      }
    }
    
    if (contentType === 'article') {
      if (!formData.content) {
        errors.content = 'Article content is required';
      }
      
      if (formData.content && formData.content.length < 100) {
        errors.content = 'Article content should be at least 100 characters';
      }
      
      if (!formData.readTime || formData.readTime <= 0) {
        errors.readTime = 'Read time is required and must be greater than 0';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // First verify the content using ML API
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      toast.info("Verifying content...");
      
      // Prepare the payload based on content type
      const payload = {
        title: formData.title,
        description: formData.description || '',
      };
      
      // Add content based on content type
      if (contentType === 'article') {
        payload.content = formData.content || '';
      } else if (contentType === 'video' || contentType === 'shortVideo') {
        // For the demo, we'll simulate a transcript
        payload.content = "This is a simulated transcript from the video. It would contain text extracted from the video's audio track.";
      }
      
      console.log("Sending verification request with data:", payload);
      
      let isTech = 'non_tech';
      let domainCategory = 'general';
      
      // Try API verification first
      try {
        // Step 1: Verify if content is tech-related using the first API
        const response = await fetch('https://fastapi-app-9b98.onrender.com/predict_tech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        });
        
        // Log raw response for debugging
        const rawResponse = await response.text();
        console.log("Raw tech prediction response:", rawResponse);
        
        // Parse the response manually
        try {
          const jsonResponse = JSON.parse(rawResponse);
          console.log("JSON tech response:", jsonResponse);
          
          // The actual API returns { result: "technical-related" } or { result: "Not technical-related" }
          if (jsonResponse.result) {
            isTech = jsonResponse.result.toLowerCase().includes('technical-related') && 
                    !jsonResponse.result.toLowerCase().includes('not') ? 'tech' : 'non_tech';
          } else {
            isTech = jsonResponse.prediction || jsonResponse;
          }
          
          console.log("Parsed tech result:", isTech);
        } catch (e) {
          console.error("Error parsing tech response:", e);
        }
      } catch (apiError) {
        console.error("API request failed:", apiError);
      }
      
      // If API says non-tech, use our own tech detection logic as fallback
      if (isTech === 'non_tech') {
        console.log("Using fallback tech detection");
        
        // Use keyword detection as fallback
        const techKeywords = ['programming', 'code', 'software', 'developer', 'tech', 'technology', 
                             'javascript', 'python', 'java', 'react', 'angular', 'api', 
                             'database', 'web', 'app', 'mobile', 'algorithm', 'development'];
        
        const contentText = `${payload.title} ${payload.description} ${payload.content}`.toLowerCase();
        
        const containsTechKeywords = techKeywords.some(keyword => 
          contentText.includes(keyword.toLowerCase())
        );
        
        // Override API result if we detect tech keywords
        if (containsTechKeywords) {
          isTech = 'tech';
          console.log("Fallback detected as tech content");
          toast.info("Content verified as tech via fallback detection.");
        }
      }
      
      // If it's tech content, proceed with domain classification
      if (isTech === 'tech') {
        // Step 2: Get the domain classification using the second API
        toast.info("Content verified as tech. Classifying domain...");
        
        try {
          const domainResponse = await fetch('https://fastapi-app-9b98.onrender.com/predict_domain', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
          });
          
          // Log raw domain response for debugging
          const rawDomainResponse = await domainResponse.text();
          console.log("Raw domain prediction response:", rawDomainResponse);
          
          // Parse domain response manually
          try {
            const jsonDomainResponse = JSON.parse(rawDomainResponse);
            console.log("JSON domain response:", jsonDomainResponse);
            
            // The actual API returns { domain: "Web Development" } or { domain: "Unknown Domain" }
            if (jsonDomainResponse.domain) {
              domainCategory = jsonDomainResponse.domain === "Unknown Domain" ? 
                              "general" : jsonDomainResponse.domain;
            } else {
              domainCategory = jsonDomainResponse.prediction || jsonDomainResponse;
            }
            
            console.log("Parsed domain result:", domainCategory);
          } catch (e) {
            console.error("Error parsing domain response:", e);
          }
        } catch (apiError) {
          console.error("Domain API request failed:", apiError);
        }
        
        // If domain classification failed, use keyword-based classification
        if (domainCategory === 'general' || domainCategory === 'Unknown Domain') {
          console.log("Using fallback domain classification");
          domainCategory = classifyContentByKeywords(payload);
          console.log("Fallback domain classification:", domainCategory);
        }
        
        // Step 3: Store in database with domain classification
        toast.info(`Domain classified as: ${domainCategory}. Uploading content...`);
      }
      
      setVerificationResult({
        isValid: isTech === 'tech',
        category: isTech === 'tech' ? domainCategory : 'non_tech',
        requiresManualVerification: isTech !== 'tech',
        message: isTech === 'tech' 
          ? `Content verified as tech-related and classified as: ${domainCategory}`
          : 'Content may not be tech-related. You can request manual verification.'
      });
      
      // If content is verified as tech, proceed with upload
      if (isTech === 'tech') {
        proceedWithUpload(domainCategory);
      } else {
        toast.warning("Content not verified as tech. You may request manual verification.");
      }
      
    } catch (error) {
      console.error('Content verification failed:', error);
      toast.error("Content verification failed. Please try again or request manual verification.");
      
      setVerificationResult({
        isValid: false,
        category: 'unknown',
        requiresManualVerification: true,
        message: 'Content verification failed. You can request manual verification.'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  /**
   * Classify content by keywords as fallback mechanism
   */
  const classifyContentByKeywords = (payload) => {
    const domainKeywords = {
      'Web Development': ['javascript', 'html', 'css', 'web', 'frontend', 'react', 'angular', 'vue'],
      'Mobile Development': ['android', 'ios', 'flutter', 'react native', 'mobile', 'app'],
      'Data Science': ['data', 'machine learning', 'ml', 'analytics', 'visualization', 'statistics'],
      'Backend Development': ['server', 'api', 'database', 'sql', 'nosql', 'node', 'express', 'django'],
      'DevOps': ['docker', 'kubernetes', 'ci/cd', 'pipeline', 'deployment', 'aws', 'cloud'],
      'Cybersecurity': ['security', 'encryption', 'firewall', 'vulnerability', 'hacking']
    };
    
    const contentText = `${payload.title} ${payload.description} ${payload.content}`.toLowerCase();
    
    // Find which domain has the most keyword matches
    let maxMatches = 0;
    let result = 'general';
    
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      const matches = keywords.filter(keyword => contentText.includes(keyword.toLowerCase())).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        result = domain;
      }
    }
    
    return result;
  };

  const proceedWithUpload = (category) => {
    if (contentType === 'article') {
      // Completely standalone implementation for article upload with comprehensive debugging
      const uploadArticleDirectly = async () => {
        try {
          console.log('Starting direct article upload...');
          
          // Create FormData with precisely what the backend expects
          const articleData = new FormData();
          articleData.append('title', formData.title);
          articleData.append('content', formData.content);
          articleData.append('readTime', parseInt(formData.readTime || '5', 10));
          
          // IMPORTANT: Backend requires techTags as an actual array, not a JSON string
          // The multer body parser and express-validator expect this format for arrays
          const tags = formData.techTags?.split(',').map(tag => tag.trim()).filter(Boolean) || ['general'];
          tags.forEach(tag => {
            articleData.append('techTags[]', tag);
          });
          
          // Cover image with backend-expected field name
          if (formData.coverImageFile) {
            articleData.append('coverImage', formData.coverImageFile);
          }
          
          // Get raw token from localStorage
          const token = localStorage.getItem('token');
          console.log('Token available:', !!token);
          
          // Display request details for debugging
          console.log('Request details:');
          console.log('- URL: /api/content/articles');
          console.log('- Method: POST');
          console.log('- Auth: Bearer Token', token ? 'present' : 'missing');
          console.log('- FormData keys:', [...articleData.keys()]);
          
          // Use fetch API directly
          const response = await fetch('/api/content/articles', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: articleData,
            credentials: 'include' // Include cookies in case the token is also stored as a cookie
          });
          
          console.log('Response status:', response.status);
          
          // Try to parse response
          let responseData;
          try {
            const text = await response.text();
            console.log('Raw response:', text);
            try {
              responseData = JSON.parse(text);
              console.log('Parsed response:', responseData);
            } catch (e) {
              console.log('Response is not valid JSON');
            }
          } catch (e) {
            console.log('Error reading response body');
          }
          
          // Show appropriate toast based on result
          if (response.ok) {
            toast.success('Article uploaded successfully!');
            return true;
          } else {
            const errorMessage = responseData?.message || `Server error: ${response.status}`;
            toast.error(`Upload failed: ${errorMessage}`);
            
            // Special handling for 401 error
            if (response.status === 401) {
              toast.error('Authentication error. Please log out and log in again.');
            }
            
            return false;
          }
        } catch (error) {
          console.error('Critical error during upload:', error);
          toast.error(`Upload error: ${error.message}`);
          return false;
        }
      };
      
      // Execute the direct upload
      uploadArticleDirectly();
      
    } else if (contentType === 'video') {
      const formDataToSend = new FormData();
      
      // Common fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');

      // Ensure techTags is properly formatted as a JSON array
      const tagsArray = formData.techTags?.split(',').map(tag => tag.trim()) || ['general'];
      tagsArray.forEach(tag => {
        formDataToSend.append('techTags[]', tag);
      });
      
      formDataToSend.append('techCategory', category || 'general'); // Add verified category
      formDataToSend.append('userId', user?.id || ''); // Make sure we include the user ID
      formDataToSend.append('verificationStatus', 'verified'); // Add verification status
      
      console.log(`Proceeding with upload for ${contentType} with category: ${category}`);
      console.log('User ID being sent:', user?.id);
      
      // Content specific fields
      formDataToSend.append('videoFile', formData.videoFile);
      formDataToSend.append('thumbnailFile', formData.thumbnailFile);
      
      // Make the API call
      console.log('Dispatching uploadVideo action');
      dispatch(uploadVideo(formDataToSend))
        .unwrap() // Properly handle the promise from Redux Toolkit
        .then(response => {
          console.log('Upload video response:', response);
          // Show success notification
          toast.success('Video content verified and uploaded successfully!', {
            position: "top-right",
            autoClose: 5000,
          });
        })
        .catch(error => {
          console.error('Upload video error:', error);
          toast.error('Error uploading video: ' + (error.message || 'Unknown error'));
        });
        
    } else if (contentType === 'shortVideo') {
      const formDataToSend = new FormData();
      
      // Common fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');

      // Ensure techTags is properly formatted as a JSON array
      const tagsArray = formData.techTags?.split(',').map(tag => tag.trim()) || ['general'];
      tagsArray.forEach(tag => {
        formDataToSend.append('techTags[]', tag);
      });
      
      formDataToSend.append('techCategory', category || 'general'); // Add verified category
      formDataToSend.append('userId', user?.id || ''); // Make sure we include the user ID
      formDataToSend.append('verificationStatus', 'verified'); // Add verification status
      
      console.log(`Proceeding with upload for ${contentType} with category: ${category}`);
      console.log('User ID being sent:', user?.id);
      
      // Content specific fields
      formDataToSend.append('videoFile', formData.videoFile);
      formDataToSend.append('thumbnailFile', formData.thumbnailFile);
      
      console.log('Dispatching uploadShortVideo action');
      dispatch(uploadShortVideo(formDataToSend))
        .unwrap() // Properly handle the promise from Redux Toolkit
        .then(response => {
          console.log('Upload short video response:', response);
          toast.success('Short video content verified and uploaded successfully!', {
            position: "top-right",
            autoClose: 5000,
          });
        })
        .catch(error => {
          console.error('Upload short video error:', error);
          toast.error('Error uploading short video: ' + (error.message || 'Unknown error'));
        });
    }
  };

  const handleRequestManualVerification = async () => {
    setRequestManualVerification(true);
    
    try {
      // Prepare the manual verification request
      const verificationRequest = {
        userId: user?.id,
        contentType: contentType,
        title: formData.title,
        description: formData.description || '',
        contentPreview: contentType === 'article' ? formData.content.substring(0, 200) + '...' : 'Media content',
        reason: "ML model classified as non-tech, requesting human review",
        timestamp: new Date().toISOString()
      };
      
      // In a real app, this would be an API call to request manual verification
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Your content has been submitted for manual verification. We will notify you once it has been reviewed.', {
        position: "top-right",
        autoClose: 7000,
      });
      
      // Reset form and go back to content type selection
      setContentType(null);
      setRequestManualVerification(false);
      setVerificationResult(null);
      
    } catch (error) {
      console.error('Manual verification request failed:', error);
      toast.error('Failed to request manual verification. Please try again.');
      setRequestManualVerification(false);
    }
  };

  const getContentTypeTitle = () => {
    switch(contentType) {
      case 'article':
        return 'Article';
      case 'shortVideo':
        return 'Short Video';
      case 'video':
        return 'Video';
      default:
        return '';
    }
  };

  const handleBackToContentSelection = () => {
    setContentType(null);
    setShowForm(false);
  };

  const renderContentTypeSelection = () => {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Upload Your Content</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article Card */}
          <div
            onClick={() => setContentType('article')}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 h-64"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaNewspaper className="text-primary text-2xl" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Article</h2>
            <p className="text-gray-600 text-center">Share your knowledge with written content</p>
          </div>
          
          {/* Short Video Card */}
          <div
            onClick={() => setContentType('shortVideo')}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 h-64"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FaFileVideo className="text-purple-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Short Video</h2>
            <p className="text-gray-600 text-center">Create quick tech tutorials or tips (under 60 seconds)</p>
          </div>
          
          {/* Video Card */}
          <div
            onClick={() => setContentType('video')}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 h-64"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaVideo className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Video</h2>
            <p className="text-gray-600 text-center">Upload in-depth tech videos and tutorials</p>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>All content will be verified by our ML model before publishing</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MainHeader title="Upload Content" />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
            {uploadStatus.success ? (
              <div className="text-center py-10">
                <div className="flex justify-center">
                  <FaCheck className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="mt-4 text-2xl font-medium text-gray-900">Upload Successful!</h2>
                <p className="mt-2 text-gray-600">
                  Your content has been uploaded successfully and is now available on the platform.
                </p>
                <button
                  onClick={() => {
                    dispatch(resetUploadStatus());
                    setContentType(null);
                  }}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Upload Another
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Upload Content</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Share your tech knowledge with the community
                </p>
                
                {!showForm ? (
                  renderContentTypeSelection()
                ) : (
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <button
                        onClick={handleBackToContentSelection}
                        className="text-primary hover:text-blue-700 text-sm font-medium"
                      >
                        &larr; Back to content types
                      </button>
                      <span className="text-gray-500">|</span>
                      <h2 className="text-lg font-medium text-gray-900">
                        {getContentTypeTitle()}
                      </h2>
                    </div>
                    
                    {/* Verification Result */}
                    {verificationResult && (
                      <div className={`mb-6 p-4 rounded-md ${
                        verificationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {verificationResult.isValid ? (
                              <FaCheck className="h-5 w-5 text-green-500" />
                            ) : (
                              <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${
                              verificationResult.isValid ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              Content Verification Result
                            </h3>
                            <div className={`mt-2 text-sm ${
                              verificationResult.isValid ? 'text-green-700' : 'text-yellow-700'
                            }`}>
                              <p>{verificationResult.message}</p>
                            </div>
                            {verificationResult.requiresManualVerification && (
                              <div className="mt-4">
                                <button
                                  type="button"
                                  onClick={handleRequestManualVerification}
                                  disabled={requestManualVerification}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                  {requestManualVerification ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <>Request Manual Verification</>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Form */}
                    <form onSubmit={handleSubmit}>
                      {/* Common Fields */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md ${
                            formErrors.title ? 'border-red-300' : 'border-gray-300'
                          } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
                        />
                        {formErrors.title && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="techTags" className="block text-sm font-medium text-gray-700">
                          Tech Tags * <span className="text-xs text-gray-500">(comma separated)</span>
                        </label>
                        <input
                          type="text"
                          id="techTags"
                          name="techTags"
                          value={formData.techTags}
                          onChange={handleChange}
                          placeholder="e.g. JavaScript, React, WebDev"
                          className={`mt-1 block w-full rounded-md ${
                            formErrors.techTags ? 'border-red-300' : 'border-gray-300'
                          } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
                        />
                        {formErrors.techTags && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.techTags}</p>
                        )}
                      </div>
                      
                      {/* Video and Short Video Fields */}
                      {(contentType === 'video' || contentType === 'shortVideo') && (
                        <>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description *
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows="3"
                              value={formData.description}
                              onChange={handleChange}
                              className={`mt-1 block w-full rounded-md ${
                                formErrors.description ? 'border-red-300' : 'border-gray-300'
                              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
                            ></textarea>
                            {formErrors.description && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">
                              Video File *
                            </label>
                            <input
                              type="file"
                              id="videoFile"
                              name="videoFile"
                              accept="video/*"
                              onChange={handleFileChange}
                              className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 ${
                                formErrors.videoFile ? 'border border-red-300 rounded-md' : ''
                              }`}
                            />
                            {formErrors.videoFile && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.videoFile}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-700">
                              Thumbnail Image *
                            </label>
                            <input
                              type="file"
                              id="thumbnailFile"
                              name="thumbnailFile"
                              accept="image/*"
                              onChange={handleFileChange}
                              className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 ${
                                formErrors.thumbnailFile ? 'border border-red-300 rounded-md' : ''
                              }`}
                            />
                            {formErrors.thumbnailFile && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.thumbnailFile}</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {/* Article Fields */}
                      {contentType === 'article' && (
                        <>
                          <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                              Article Content *
                            </label>
                            <textarea
                              id="content"
                              name="content"
                              rows="10"
                              value={formData.content}
                              onChange={handleChange}
                              className={`mt-1 block w-full rounded-md ${
                                formErrors.content ? 'border-red-300' : 'border-gray-300'
                              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
                            ></textarea>
                            {formErrors.content && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
                              Read Time (minutes) *
                            </label>
                            <input
                              type="number"
                              id="readTime"
                              name="readTime"
                              min="1"
                              value={formData.readTime}
                              onChange={handleChange}
                              className={`mt-1 block w-full rounded-md ${
                                formErrors.readTime ? 'border-red-300' : 'border-gray-300'
                              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
                            />
                            {formErrors.readTime && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.readTime}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="coverImageFile" className="block text-sm font-medium text-gray-700">
                              Cover Image (optional)
                            </label>
                            <input
                              type="file"
                              id="coverImageFile"
                              name="coverImageFile"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Preview */}
                      {preview && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <img src={preview} alt="Thumbnail preview" className="max-h-48 object-contain" />
                          </div>
                        </div>
                      )}
                      
                      {/* Submit Button */}
                      <div>
                        <p className="text-sm text-gray-500 mb-4">
                          Content will be verified by our ML model before publishing
                        </p>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={uploadStatus.loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            {uploadStatus.loading ? (
                              <LoadingSpinner />
                            ) : (
                              <>
                                <FaUpload className="mr-2" />
                                Upload
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
