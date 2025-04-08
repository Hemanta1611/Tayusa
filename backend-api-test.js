// Standalone test script for the backend API
// This will test the backend API directly with a minimal request

const runTest = async () => {
  console.log('===== BACKEND API TEST =====');
  
  // Get the token
  const token = localStorage.getItem('token');
  console.log('Token available:', !!token);
  
  // Create a minimal test article
  const testArticleData = {
    title: 'Test Article via Direct API',
    content: 'This is a test article for API debugging.',
    readTime: 3,
    techTags: ['testing', 'api']
  };
  
  // Test with JSON data first (simplest approach)
  try {
    console.log('Testing JSON article upload...');
    
    const jsonResponse = await fetch('/api/content/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testArticleData)
    });
    
    console.log('JSON Response Status:', jsonResponse.status);
    
    try {
      const jsonData = await jsonResponse.json();
      console.log('JSON Response:', jsonData);
    } catch (e) {
      console.log('Error parsing JSON response:', await jsonResponse.text());
    }
  } catch (error) {
    console.error('JSON Test Error:', error);
  }
  
  // Test with FormData as well
  try {
    console.log('\nTesting FormData article upload...');
    
    const formData = new FormData();
    formData.append('title', testArticleData.title);
    formData.append('content', testArticleData.content);
    formData.append('readTime', testArticleData.readTime);
    formData.append('techTags', JSON.stringify(testArticleData.techTags));
    
    const formResponse = await fetch('/api/content/articles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    console.log('FormData Response Status:', formResponse.status);
    
    try {
      const formData = await formResponse.json();
      console.log('FormData Response:', formData);
    } catch (e) {
      console.log('Error parsing FormData response:', await formResponse.text());
    }
  } catch (error) {
    console.error('FormData Test Error:', error);
  }
};

// Export function to run in browser console
window.testBackendAPI = runTest;

console.log('Test script loaded. Run window.testBackendAPI() in the console to execute the test.');
