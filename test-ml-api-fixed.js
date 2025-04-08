// Updated script to test the ML API with correct format

const axios = require('axios');

(async () => {
  console.log('Testing ML API connection with correct format...');
  
  const apiUrl = 'https://fastapi-app-9b98.onrender.com/predict_tech/';
  
  // Test with tech content
  const techData = {
    title: "Python in Machine Learning and AI",
    description: "Python is an excellent language for machine learning and AI applications. It has libraries like TensorFlow and PyTorch."
  };
  
  try {
    console.log('\nSending tech-related content...');
    const techResponse = await axios.post(apiUrl, techData);
    console.log('Response:', techResponse.data);
    
    // Test with non-tech content
    const nonTechData = {
      title: "A Beautiful Day",
      description: "The weather is nice today and I like flowers and nature. The sky is blue and the birds are singing."
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
