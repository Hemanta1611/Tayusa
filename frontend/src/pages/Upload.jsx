import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo, uploadShortVideo, uploadArticle, resetUploadStatus } from '../store/slices/contentSlice';
import { FaVideo, FaFileVideo, FaNewspaper, FaUpload } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

function Upload() {
  const [contentType, setContentType] = useState('video');
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

  const dispatch = useDispatch();
  const { uploadStatus } = useSelector(state => state.content);

  // Reset upload status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetUploadStatus());
    };
  }, [dispatch]);

  // Clear form when content type changes
  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formDataToSend = new FormData();
    
    // Common fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('techTags', formData.techTags.split(',').map(tag => tag.trim()));
    
    if (contentType === 'video' || contentType === 'shortVideo') {
      formDataToSend.append('description', formData.description);
      formDataToSend.append('video', formData.videoFile);
      formDataToSend.append('thumbnail', formData.thumbnailFile);
      
      // Dispatch based on content type
      if (contentType === 'video') {
        dispatch(uploadVideo(formDataToSend));
      } else {
        dispatch(uploadShortVideo(formDataToSend));
      }
    } else if (contentType === 'article') {
      formDataToSend.append('content', formData.content);
      formDataToSend.append('readTime', formData.readTime);
      
      if (formData.coverImageFile) {
        formDataToSend.append('coverImage', formData.coverImageFile);
      }
      
      dispatch(uploadArticle(formDataToSend));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Upload Content</h1>
      
      {/* Content Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Content Type</h2>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setContentType('video')}
            className={`flex items-center px-4 py-3 rounded-lg ${
              contentType === 'video'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaVideo className="mr-2" />
            Long Video
          </button>
          <button
            type="button"
            onClick={() => setContentType('shortVideo')}
            className={`flex items-center px-4 py-3 rounded-lg ${
              contentType === 'shortVideo'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFileVideo className="mr-2" />
            Short Video
          </button>
          <button
            type="button"
            onClick={() => setContentType('article')}
            className={`flex items-center px-4 py-3 rounded-lg ${
              contentType === 'article'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaNewspaper className="mr-2" />
            Article
          </button>
        </div>
      </div>
      
      {/* Upload Success Message */}
      {uploadStatus.success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          <p className="font-semibold">Upload Successful!</p>
          <p className="mt-1">Your content has been submitted for verification. It will be available once approved.</p>
          <button
            onClick={() => dispatch(resetUploadStatus())}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Upload Another
          </button>
        </div>
      )}
      
      {/* Upload Error Message */}
      {uploadStatus.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <p className="font-semibold">Upload Failed</p>
          <p className="mt-1">{uploadStatus.error}</p>
        </div>
      )}
      
      {/* Upload Form */}
      {!uploadStatus.success && (
        <form onSubmit={handleSubmit} className="space-y-6">
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
              Tech Tags * (comma separated)
            </label>
            <input
              type="text"
              id="techTags"
              name="techTags"
              value={formData.techTags}
              onChange={handleChange}
              placeholder="react, javascript, web development"
              className={`mt-1 block w-full rounded-md ${
                formErrors.techTags ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            />
            {formErrors.techTags && (
              <p className="mt-1 text-sm text-red-600">{formErrors.techTags}</p>
            )}
          </div>
          
          {/* Video/Short Video Fields */}
          {(contentType === 'video' || contentType === 'shortVideo') && (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
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
        </form>
      )}
    </div>
  );
}

export default Upload;
