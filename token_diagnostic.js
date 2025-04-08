// Token diagnostic tool
// Run this in the browser console to check authentication state

const checkAuthToken = () => {
  console.log('=== AUTH TOKEN DIAGNOSTIC ===');
  
  // Check localStorage
  const localToken = localStorage.getItem('token');
  console.log('Token in localStorage:', localToken ? `Present (${localToken.substring(0, 15)}...)` : 'Missing');
  
  // Check Redux store if available
  try {
    const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
                 window.__REDUX_DEVTOOLS_EXTENSION__.getState() : null;
    
    if (state && state.state && state.state.auth) {
      console.log('Redux auth state:', state.state.auth);
      console.log('Redux token:', state.state.auth.token ? 
                 `Present (${state.state.auth.token.substring(0, 15)}...)` : 'Missing');
      console.log('User authenticated:', state.state.auth.isAuthenticated);
    } else {
      console.log('Redux state not accessible via DevTools extension');
    }
  } catch (e) {
    console.log('Error accessing Redux state:', e.message);
  }
  
  // Test API call with token
  const testApiAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const resp = await fetch('/api/content/articles', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Auth test response status:', resp.status);
      console.log('Auth test response ok:', resp.ok);
      
      if (resp.status === 401) {
        console.log('⚠️ Auth failed - token might be invalid or expired');
      } else if (resp.ok) {
        console.log('✅ Auth successful');
      }
    } catch (e) {
      console.log('Error testing auth:', e.message);
    }
  };
  
  testApiAuth();
};

// Run the diagnostic
checkAuthToken();
