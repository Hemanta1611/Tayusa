// Simple script to test the FastAPI endpoints directly
const fetch = require('node-fetch');

const testEndpoints = async () => {
  console.log('Starting API test');
  
  // Test data
  const testPayload = {
    title: 'JavaScript Best Practices',
    description: 'A guide to writing clean JavaScript code',
    content: 'JavaScript is a versatile programming language used for web development. Here are some best practices for writing clean and maintainable code.'
  };
  
  try {
    console.log('Testing /predict_tech endpoint');
    console.log('Sending payload:', testPayload);
    
    // Test the tech prediction endpoint
    const techResponse = await fetch('https://fastapi-app-9b98.onrender.com/predict_tech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const techResponseText = await techResponse.text();
    console.log('Raw response:', techResponseText);
    
    try {
      const techJson = JSON.parse(techResponseText);
      console.log('Parsed response:', techJson);
    } catch (e) {
      console.log('Response is not valid JSON');
    }
    
    // Test the domain prediction endpoint
    console.log('\nTesting /predict_domain endpoint');
    
    const domainResponse = await fetch('https://fastapi-app-9b98.onrender.com/predict_domain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const domainResponseText = await domainResponse.text();
    console.log('Raw response:', domainResponseText);
    
    try {
      const domainJson = JSON.parse(domainResponseText);
      console.log('Parsed response:', domainJson);
    } catch (e) {
      console.log('Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the tests
testEndpoints();
