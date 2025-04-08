// Direct implementation of article upload without Redux 
// Can be copied into Upload.jsx proceedWithUpload function

const directUploadArticle = async () => {
  const formDataToSend = new FormData();
  
  // Basic required fields according to backend validation
  formDataToSend.append('title', formData.title);
  formDataToSend.append('content', formData.content);
  formDataToSend.append('readTime', parseInt(formData.readTime || '5', 10));
  
  // Tags must be a valid array
  const tagsArray = formData.techTags?.split(',').map(tag => tag.trim()).filter(Boolean) || ['general'];
  formDataToSend.append('techTags', JSON.stringify(tagsArray));
  
  // Add cover image if present, with correct field name 'coverImage'
  if (formData.coverImageFile) {
    formDataToSend.append('coverImage', formData.coverImageFile);
  }
  
  // Always use the token from localStorage, as that's where the axios interceptor gets it
  const token = localStorage.getItem('token');
  
  // First, try using axios directly with all important headers
  try {
    console.log('Attempting direct axios POST without Redux...');
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };
    
    // Print request for debugging
    console.log('Request URL:', '/api/content/articles');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    console.log('FormData entries:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`  ${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
    }
    
    try {
      const response = await axios.post('/api/content/articles', formDataToSend, config);
      console.log('Axios success response:', response.data);
      toast.success('Article uploaded successfully!');
      return true;
    } catch (axiosError) {
      console.error('Axios error:', axiosError);
      console.log('Status:', axiosError.response?.status);
      console.log('Response data:', axiosError.response?.data);
      
      // Special handling for 401 errors
      if (axiosError.response?.status === 401) {
        console.error('Authentication failed. Token might be invalid.');
        toast.error('Authentication failed. Please try logging in again.');
      } else {
        toast.error(`Upload failed: ${axiosError.response?.data?.message || axiosError.message}`);
      }
      
      return false;
    }
  } catch (error) {
    console.error('General error:', error);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};

// To use this in the proceedWithUpload function:
// Replace the try/catch block for articles with a single call:
// directUploadArticle();
