/**
 * ML API Integration Update
 * 
 * Steps to properly integrate with the FastAPI ML service:
 * 
 * 1. Create or update .env file in backend directory with:
 *    ML_API_URL=https://fastapi-app-9b98.onrender.com
 *    ML_API_ENDPOINT=predict_tech
 * 
 * 2. Update contentController.js to use the correct endpoint format
 *    (see code changes below)
 */

// PART 1: HOW TO UPDATE THE ENVIRONMENT VARIABLES
// Add this to backend/.env
// ML_API_URL=https://fastapi-app-9b98.onrender.com
// ML_API_ENDPOINT=predict_tech

// PART 2: UPDATE THE CONTENT CONTROLLER
// Replace the ML API call section in uploadArticle with:

// Verify if content is tech-related using ML API
let verificationResult;
try {
  // Format the request according to the FastAPI endpoint requirements
  const response = await axios.post(`${ML_API_URL}/${process.env.ML_API_ENDPOINT || 'predict_tech'}`, {
    text: `${title} ${content}` // Combine title and content as the API expects a single text field
  });

  console.log('ML API Response:', response.data);
  
  // Map the FastAPI response format to our internal format
  verificationResult = {
    is_tech_related: response.data.is_tech_related,
    confidence: response.data.confidence || 0.5,
    passes_threshold: response.data.is_tech_related === true
  };
} catch (error) {
  console.error('ML API verification error:', error.message);
  // If ML API fails, set verification status to pending
  verificationResult = {
    is_tech_related: false,
    confidence: 0,
    passes_threshold: false
  };
}

/**
 * Testing the ML API directly
 * 
 * You can test if the API is working correctly with this script:
 */

const testMlApi = async () => {
  const axios = require('axios');
  
  const testData = {
    text: "Python is a popular programming language for machine learning and AI"
  };
  
  try {
    console.log('Testing ML API with tech content...');
    const techResponse = await axios.post('https://fastapi-app-9b98.onrender.com/predict_tech', testData);
    console.log('Tech content response:', techResponse.data);
    
    // Test with non-tech content
    const nonTechData = {
      text: "The weather is nice today and I like to go for walks in the park"
    };
    
    console.log('\nTesting ML API with non-tech content...');
    const nonTechResponse = await axios.post('https://fastapi-app-9b98.onrender.com/predict_tech', nonTechData);
    console.log('Non-tech content response:', nonTechResponse.data);
    
    return true;
  } catch (error) {
    console.error('Error testing ML API:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
    return false;
  }
};

// To run this test, execute:
// node ml-api-integration.js
if (require.main === module) {
  testMlApi()
    .then(success => {
      console.log('\nTest completed:', success ? 'Successfully' : 'With errors');
      process.exit(success ? 0 : 1);
    });
}
