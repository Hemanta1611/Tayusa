// Simple script to test the ML API

const axios = require('axios');

// Test function using async/await inside an async IIFE
(async () => {
  console.log('Testing ML API connection...');
  
  const apiUrl = 'https://fastapi-app-9b98.onrender.com/predict_tech';
  
  // Test with tech content
  const techData = {
    text: "Python is an excellent language for machine learning and AI applications"
  };
  
  try {
    console.log('\nSending tech-related content...');
    const techResponse = await axios.post(apiUrl, techData);
    console.log('Response:', techResponse.data);
    
    // Test with non-tech content
    const nonTechData = {
      text: "The weather is nice today and I like flowers and nature"
    };
    
    console.log('\nSending non-tech content...');
    const nonTechResponse = await axios.post(apiUrl, nonTechData);
    console.log('Response:', nonTechResponse.data);
    
    console.log('\nAPI test completed successfully!');
  } catch (error) {
    console.error('\nError testing ML API:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
})();
