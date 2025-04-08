/**
 * Authentication & API Test Script
 * This script can be run in the browser console to test authentication and API endpoints
 */

const runAuthTest = async () => {
  console.log('========== Authentication and API Test ==========');
  
  // 1. Check for token in all possible locations
  const localStorageToken = localStorage.getItem('token');
  const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('token='));
  
  console.log('Token in localStorage:', localStorageToken ? `Present (${localStorageToken.substring(0, 15)}...)` : 'Missing');
  console.log('Token in cookies:', cookieToken ? `Present (${cookieToken.split('=')[1].substring(0, 15)}...)` : 'Missing');
  
  // 2. Test a simple GET endpoint that requires authentication
  try {
    console.log('\nTesting GET /api/content/articles endpoint...');
    
    const getResponse = await fetch('/api/content/articles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorageToken}`
      },
      credentials: 'include'
    });
    
    console.log('GET Response status:', getResponse.status);
    
    if (getResponse.status === 401) {
      console.error('❌ Authentication failed - token is invalid or missing.');
      console.log('Try logging out and back in to refresh your token.');
    } else if (getResponse.ok) {
      console.log('✅ GET request successful - authentication is working!');
      
      // If GET works, try a minimal POST
      console.log('\nTesting minimal POST to /api/content/articles...');
      
      const minimalData = new FormData();
      minimalData.append('title', 'API Test Article');
      minimalData.append('content', 'This is a test article with the minimum required content length to pass validation. It needs to be at least 100 characters long so I am adding more text here.');
      minimalData.append('readTime', '5');
      minimalData.append('techTags[]', 'testing');
      
      const postResponse = await fetch('/api/content/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorageToken}`
        },
        credentials: 'include',
        body: minimalData
      });
      
      console.log('POST Response status:', postResponse.status);
      
      if (postResponse.ok) {
        console.log('✅ POST request successful!');
      } else {
        console.error('❌ POST request failed even though GET succeeded.');
        console.log('Possible issues:');
        console.log('1. Missing or invalid form fields');
        console.log('2. Server-side validation error');
        console.log('3. Different authentication requirements for POST');
      }
      
      // Try to print response details
      try {
        const responseText = await postResponse.text();
        console.log('Response text:', responseText);
        
        try {
          const responseJson = JSON.parse(responseText);
          console.log('Response as JSON:', responseJson);
        } catch (e) {
          console.log('Response is not valid JSON');
        }
      } catch (e) {
        console.log('Could not read response body');
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
  
  // 3. Look for API URL issues
  console.log('\nChecking API base URL configuration:');
  
  // Try to determine base URL from environment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Running on localhost - Are you sure your backend API is running?');
    console.log('Default API URL is likely: http://localhost:[PORT]/api');
  }
  
  console.log('\nAPI URL check:');
  console.log('Current page origin:', window.location.origin);
  console.log('Your API requests are going to:', window.location.origin + '/api/content/articles');
  
  // 4. Additional checks for complex debugging
  console.log('\nAdditional troubleshooting:');
  console.log('- Check browser network tab for actual requests and responses');
  console.log('- Verify token expiration (common issue)');
  console.log('- Check backend logs for specific authentication errors');
  console.log('- Try logging out and back in to refresh token');
};

// Run the test
runAuthTest();

// Also make it available as a global function for manual testing
window.runAuthTest = runAuthTest;
