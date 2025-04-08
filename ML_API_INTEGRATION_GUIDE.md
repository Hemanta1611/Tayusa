# ML API Integration Guide for Tayusa

This guide provides step-by-step instructions for implementing the ML API fix to properly classify tech vs. non-tech articles.

## Overview of the Fix

We've identified that the backend was using an incorrect format when calling the ML API. The fix updates the API call to match the expected format and properly interprets the response.

## Implementation Steps

### 1. Update Environment Variables

Create or modify the `.env` file in your backend directory:

```
ML_API_URL=https://fastapi-app-9b98.onrender.com
```

### 2. Update the Content Controller

**Option A: Replace the entire file**
1. Back up your original controller: `cp contentController.js contentController.js.backup`
2. Replace it with the updated version: `cp contentController-updated.js contentController.js`

**Option B: Update just the ML API section**
1. Open `contentController.js`
2. Find the `uploadArticle` function
3. Replace the ML API verification section with the updated code:

```javascript
// Verify if content is tech-related using ML API
let verificationResult;
try {
  // Format the request according to the API requirements
  const response = await axios.post(`${ML_API_URL}/predict_tech/`, {
    title: title,
    description: content
  });

  console.log('ML API Response:', response.data);
  
  // Map the API response to our internal format
  const isTechRelated = response.data.result === 'Technical-related';
  
  verificationResult = {
    is_tech_related: isTechRelated,
    confidence: isTechRelated ? 0.8 : 0.2,
    passes_threshold: isTechRelated
  };
} catch (error) {
  console.error('ML API verification error:', error.message);
  if (error.response) {
    console.error('Error details:', error.response.status, error.response.data);
  }
  verificationResult = {
    is_tech_related: false,
    confidence: 0,
    passes_threshold: false
  };
}
```

### 3. Update the ML_API_URL Constant

At the top of your controller file, update:

```javascript
const ML_API_URL = process.env.ML_API_URL || 'https://fastapi-app-9b98.onrender.com';
```

## Testing the Fix

### 1. Restart Your Backend Server

```
npm run dev
```

### 2. Upload a Tech Article

Create an article with clearly tech-related content:
- Title: "Python for Machine Learning"
- Content: Include technical terms and concepts related to programming

Expected result:
- Article should be saved with `verified: true` and `verificationStatus: 'approved'`

### 3. Upload a Non-Tech Article

Create an article with non-tech content:
- Title: "My Favorite Recipes"
- Content: Write about cooking, food, or other non-technical topics

Expected result:
- Article should be saved with `verified: false` and `verificationStatus: 'pending'`

## Troubleshooting

If you encounter issues:

1. Check the backend console logs for detailed error messages
2. Verify your network connection to the ML API
3. Run the test script to directly check the API connection:
   ```
   node test-ml-api-fixed.js
   ```

## Understanding the Model Response

The ML API returns:
- `{ result: 'Technical-related' }` for tech content
- `{ result: 'Not technical-related' }` for non-tech content

Our backend translates this to:
- `verified: true` & `verificationStatus: 'approved'` for tech content
- `verified: false` & `verificationStatus: 'pending'` for non-tech content

## Additional Notes

- The ML API requires both `title` and `description` fields
- The model seems to work well for clearly technical content but may have limitations with ambiguous content
- All uploads will succeed, but non-tech content will be marked as pending
