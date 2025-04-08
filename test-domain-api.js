// Test script for the domain prediction API

const axios = require('axios');

(async () => {
  console.log('Testing Domain Classification API...');
  
  const apiUrl = 'https://fastapi-app-9b98.onrender.com/predict_domain/';
  
  // Test with web development content
  const webDevData = {
    title: "Modern React Hooks and State Management",
    description: "This article covers the latest React hooks for efficient state management in frontend applications, including useState, useEffect, and custom hooks for data fetching."
  };
  
  try {
    console.log('\nSending web development content...');
    const webDevResponse = await axios.post(apiUrl, webDevData);
    console.log('Response:', webDevResponse.data);
    
    // Test with data science content
    const dataScience = {
      title: "Machine Learning for Image Classification",
      description: "Exploring deep learning techniques for image classification using TensorFlow and PyTorch. We'll implement convolutional neural networks and understand transfer learning approaches."
    };
    
    console.log('\nSending data science content...');
    const dataScienceResponse = await axios.post(apiUrl, dataScience);
    console.log('Response:', dataScienceResponse.data);
    
    // Test with backend dev content
    const backendData = {
      title: "Building Scalable Node.js APIs",
      description: "Learn how to design and implement highly scalable RESTful APIs using Node.js, Express, and MongoDB. We'll cover authentication, authorization, and performance optimization techniques."
    };
    
    console.log('\nSending backend dev content...');
    const backendResponse = await axios.post(apiUrl, backendData);
    console.log('Response:', backendResponse.data);
    
    console.log('\nAPI test completed successfully!');
  } catch (error) {
    console.error('\nError testing Domain API:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
})();
