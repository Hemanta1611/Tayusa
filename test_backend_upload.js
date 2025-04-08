// Test script to debug article upload to the backend
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const testArticleUpload = async () => {
  console.log('Testing article upload to backend');
  
  // Create test article data
  const formData = new FormData();
  formData.append('title', 'Test Tech Article');
  formData.append('content', 'This is a test article about React development. It includes technical content about JavaScript frameworks.');
  formData.append('description', 'A test technical article');
  formData.append('readTime', '5');
  formData.append('techTags', JSON.stringify(['react', 'javascript']));
  formData.append('techCategory', 'Web Development');
  formData.append('userId', '65c8f2d4bd0e0e96f4ba7e6a'); // Example user ID - use a valid ID from your system
  formData.append('verificationStatus', 'verified');
  
  // If you have a cover image (commented out for this test)
  // const coverImagePath = 'path/to/test/image.jpg';
  // formData.append('coverImageFile', fs.createReadStream(coverImagePath));
  
  try {
    console.log('Sending direct request to backend API');
    
    // Log the headers that will be sent
    console.log('Form data keys:', [...formData.keys()]);
    
    // Make direct API request to backend
    const response = await fetch('http://localhost:5000/api/content/articles', {
      method: 'POST',
      headers: {
        // Let form-data set its own content-type with boundary
        'Authorization': 'Bearer YOUR_VALID_JWT_TOKEN' // Replace with valid token
      },
      body: formData
    });
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const json = JSON.parse(responseText);
      console.log('JSON response:', json);
    } catch (e) {
      console.log('Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('Upload test failed:', error);
  }
};

// Run the test
// Uncomment and run when you have valid credentials
// testArticleUpload();

// Export a function we can use in the React debugging
module.exports = {
  monitorFormData: (formData) => {
    console.log('Form data submitted:', formData);
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
    }
    return formData;
  }
};
