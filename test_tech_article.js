// Test script to verify technical content detection
const fetch = require('node-fetch');

const testTechContent = async () => {
  console.log('Testing with clearly tech-related content');
  
  // Test data - this should be detected as tech-related
  const techArticle = {
    title: 'How to Build a React Application with Hooks',
    description: 'A comprehensive guide to using React Hooks for state management',
    content: `
      React Hooks are a powerful feature introduced in React 16.8 that allow developers to use state and other React features 
      without writing a class component. In this article, we'll explore how to use useState, useEffect, and useContext to build
      a complete React application.
      
      First, let's start by creating a new React project:
      \`\`\`
      npx create-react-app my-hooks-app
      cd my-hooks-app
      npm start
      \`\`\`
      
      Now, let's create a component that uses useState:
      \`\`\`jsx
      import React, { useState } from 'react';
      
      function Counter() {
        const [count, setCount] = useState(0);
        
        return (
          <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
              Click me
            </button>
          </div>
        );
      }
      \`\`\`
      
      This demonstrates how useState allows us to add state to functional components.
    `
  };
  
  try {
    console.log('Testing /predict_tech endpoint with tech article');
    
    // Test the tech prediction endpoint
    const techResponse = await fetch('https://fastapi-app-9b98.onrender.com/predict_tech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(techArticle)
    });
    
    const techResponseText = await techResponse.text();
    console.log('Raw tech prediction response:', techResponseText);
    
    try {
      const techJson = JSON.parse(techResponseText);
      console.log('Parsed tech response:', techJson);
      
      // Parse the way our application would
      const isTech = techJson.result && 
        techJson.result.toLowerCase().includes('technical-related') && 
        !techJson.result.toLowerCase().includes('not') ? 
        'tech' : 'non_tech';
      
      console.log('Our application would interpret this as:', isTech);
      
      // If tech content, test domain classification
      if (isTech === 'tech') {
        console.log('\nTesting /predict_domain endpoint');
        
        const domainResponse = await fetch('https://fastapi-app-9b98.onrender.com/predict_domain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(techArticle)
        });
        
        const domainResponseText = await domainResponse.text();
        console.log('Raw domain prediction response:', domainResponseText);
        
        try {
          const domainJson = JSON.parse(domainResponseText);
          console.log('Parsed domain response:', domainJson);
          
          // Parse the way our application would
          const domainCategory = domainJson.domain === "Unknown Domain" ? 
                          "general" : domainJson.domain;
          
          console.log('Our application would classify this as:', domainCategory);
        } catch (e) {
          console.log('Domain response is not valid JSON');
        }
      }
    } catch (e) {
      console.log('Tech response is not valid JSON');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testTechContent();
