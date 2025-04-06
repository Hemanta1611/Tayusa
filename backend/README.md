# Tayusa Backend

This directory contains the Express.js backend API for the Tayusa platform.

## Structure

- **controllers/**: Houses request handlers that process incoming requests, interact with models, and send responses.
- **models/**: Contains MongoDB schema definitions using Mongoose.
- **routes/**: Defines API endpoints and routes them to their respective controllers.
- **config/**: Configuration files for database, environment variables, authentication, etc.
- **utils/**: Helper functions and utility classes.
- **tests/**: Unit and integration tests for the API.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables by creating a `.env` file in this directory.

3. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

The backend API provides endpoints for:
- User authentication (signup, login, logout)
- Content management (videos, short videos, articles)
- User interactions (likes, comments, follows)
- Content verification via ML API integration
