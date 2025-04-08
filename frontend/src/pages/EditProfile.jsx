import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaSave,
  FaUpload,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import authService from '../services/authService';
import { getUserProfile } from '../store/slices/authSlice';

function EditProfile() {
  const { user: currentUser, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Profile picture upload
  const fileInputRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    profilePicture: null,
    coverPhoto: null
  });
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real app, you would fetch the user's profile data from API
    // Using the actual user data from Redux instead of mocking
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        website: currentUser.website || '',
        location: currentUser.location || '',
        profilePicture: null,
        coverPhoto: null
      });
      
      // Set preview images if available
      if (currentUser.profilePicture) {
        setProfilePreview(currentUser.profilePicture.startsWith('http') 
          ? currentUser.profilePicture 
          : `/uploads/${currentUser.profilePicture}`);
      }
      if (currentUser.coverPhoto) {
        setCoverPreview(currentUser.coverPhoto.startsWith('http') 
          ? currentUser.coverPhoto 
          : `/uploads/${currentUser.coverPhoto}`);
      }
      
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }
    
    // Check file type (only images)
    if (!file.type.match('image.*')) {
      setError('Only image files are allowed.');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'profile') {
        setProfilePreview(reader.result);
        setFormData(prev => ({ ...prev, profilePicture: file }));
      } else if (type === 'cover') {
        setCoverPreview(reader.result);
        setFormData(prev => ({ ...prev, coverPhoto: file }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = (type) => {
    if (type === 'profile') {
      setProfilePreview(null);
      setFormData(prev => ({ ...prev, profilePicture: null }));
    } else if (type === 'cover') {
      setCoverPreview(null);
      setFormData(prev => ({ ...prev, coverPhoto: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // We need to handle the profile update differently based on whether files are included
      let updatedUserData;
      
      // Check if we have file uploads
      const hasProfilePicture = formData.profilePicture && formData.profilePicture instanceof File;
      
      if (hasProfilePicture) {
        // For file uploads, we need to use FormData
        const profileFormData = new FormData();
        
        // Add basic text fields - only include fields that are in your MongoDB schema
        if (formData.name) profileFormData.append('name', formData.name);
        if (formData.username) profileFormData.append('username', formData.username);
        if (formData.email) profileFormData.append('email', formData.email);
        if (formData.bio) profileFormData.append('bio', formData.bio);
        if (formData.website) profileFormData.append('website', formData.website);
        if (formData.location) profileFormData.append('location', formData.location);
        
        // Add profile picture
        if (hasProfilePicture) {
          profileFormData.append('profilePicture', formData.profilePicture);
        }
        
        // Log data being sent (for debugging)
        console.log('Sending form data with files');
        
        // Send directly using fetch instead of authService for more control over FormData
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          body: profileFormData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile');
        }
        
        updatedUserData = await response.json();
      } else {
        // No files - use regular JSON for simplicity
        const profileData = {};
        
        // Only include fields that have values and match your MongoDB schema
        if (formData.name) profileData.name = formData.name;
        if (formData.username) profileData.username = formData.username;
        if (formData.email) profileData.email = formData.email;
        if (formData.bio) profileData.bio = formData.bio;
        if (formData.website) profileData.website = formData.website;
        if (formData.location) profileData.location = formData.location;
        
        console.log('Sending profile data as JSON:', profileData);
        
        // Use direct fetch with explicit URL to ensure we're hitting the right endpoint
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile');
        }
        
        updatedUserData = await response.json();
      }
      
      console.log('Response from server:', updatedUserData);
      
      // Force update Redux with the latest user data
      dispatch(getUserProfile());
      
      // Show success message
      setSuccess(true);
      
      // Navigate back to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <MainHeader />
        
        {/* Main content area */}
        <div className="pt-16 px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="mr-3 text-gray-600 hover:text-gray-800"
                  >
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold">Edit Profile</h1>
                </div>
                
                {error && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Profile updated successfully!
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* Cover photo */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Photo
                    </label>
                    <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {coverPreview ? (
                        <>
                          <img 
                            src={coverPreview} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('cover')}
                            className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <button
                            type="button"
                            onClick={() => document.getElementById('coverPhotoInput').click()}
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaUpload className="w-4 h-4 mr-2 inline-block" />
                            Upload Cover Photo
                          </button>
                          <input
                            id="coverPhotoInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Profile picture */}
                  <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={handleProfilePictureClick}
                      >
                        {profilePreview ? (
                          <img 
                            src={profilePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="w-12 h-12 text-gray-400" />
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <FaUpload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profile')}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <h3 className="text-lg font-medium">Profile Picture</h3>
                      <p className="text-sm text-gray-500">
                        Click on the circle to upload a new profile picture. <br />
                        PNG, JPG, or GIF. Max 5MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      {/* Username */}
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            @
                          </span>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="flex-1 focus:ring-primary focus:border-primary block w-full min-w-0 sm:text-sm border-gray-300 rounded-none rounded-r-md"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Website */}
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaGlobe className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div className="mt-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Tell the world a little about yourself"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Brief description for your profile. URLs are hyperlinked.
                      </p>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
