import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DebugUploadForm = () => {
  const [status, setStatus] = useState('Idle');
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  
  // Get token on component load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || 'No token found');
  }, []);
  
  const testAuth = async () => {
    setStatus('Testing auth...');
    setError(null);
    
    try {
      const storedToken = localStorage.getItem('token');
      
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      
      const data = await response.text();
      
      setStatus(`Auth test complete: ${response.status}`);
      setResponse({
        status: response.status,
        data: data
      });
      
      if (response.status === 401) {
        setError('Authentication failed - token is invalid or expired');
      }
    } catch (err) {
      setStatus('Auth test failed');
      setError(err.message);
    }
  };
  
  const testUpload = async () => {
    setStatus('Testing minimal upload...');
    setError(null);
    
    try {
      const storedToken = localStorage.getItem('token');
      
      // Create absolute minimal test data
      const formData = new FormData();
      formData.append('title', 'Debug Test Article');
      formData.append('content', 'This is a test article with minimal content to test the upload functionality. It needs to be at least 100 characters long to pass validation, so I am adding more text here.');
      formData.append('readTime', '5');
      
      // Use array notation for techTags
      formData.append('techTags[]', 'testing');
      
      // First try with fetch
      const fetchResponse = await fetch('/api/content/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
        body: formData
      });
      
      let responseText = await fetchResponse.text();
      
      setStatus(`Upload test complete: ${fetchResponse.status}`);
      setResponse({
        status: fetchResponse.status,
        method: 'fetch',
        data: responseText
      });
      
      if (fetchResponse.status === 401) {
        // Try with axios as fallback
        setStatus('Trying with axios...');
        
        const axiosResponse = await axios.post('/api/content/articles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        setStatus(`Axios upload complete: ${axiosResponse.status}`);
        setResponse({
          status: axiosResponse.status,
          method: 'axios',
          data: JSON.stringify(axiosResponse.data)
        });
      }
    } catch (err) {
      setStatus('Upload test failed');
      setError(err.message);
      
      if (err.response) {
        setResponse({
          status: err.response.status,
          data: JSON.stringify(err.response.data)
        });
      }
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '600px', margin: '20px auto' }}>
      <h2>🐞 Debug Upload Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Auth Token:</h3>
        <div style={{ 
          padding: '10px', 
          background: '#f5f5f5', 
          borderRadius: '4px', 
          wordBreak: 'break-all',
          maxHeight: '80px',
          overflow: 'auto'
        }}>
          {token ? token.substring(0, 20) + '...' : 'No token found'}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={testAuth}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Authentication
        </button>
        
        <button 
          onClick={testUpload}
          style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Minimal Upload
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status:</h3>
        <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          {status}
        </div>
      </div>
      
      {error && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Error:</h3>
          <div style={{ padding: '10px', background: '#ffebee', color: '#d32f2f', borderRadius: '4px' }}>
            {error}
          </div>
        </div>
      )}
      
      {response && (
        <div>
          <h3>Response:</h3>
          <div style={{ 
            padding: '10px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <p><strong>Status:</strong> {response.status}</p>
            {response.method && <p><strong>Method:</strong> {response.method}</p>}
            <p><strong>Data:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {response.data}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugUploadForm;
