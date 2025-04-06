# Tayusa ML API

This directory contains the FastAPI-based Machine Learning API for the Tayusa platform, providing content classification, filtering, and recommendation services.

## Features

- **Tech Content Classification**: Multi-label classification of content into 30+ tech categories
- **Content Filtering**: Verify that uploads are tech-related with confidence scoring
- **Personalized Recommendations**: Content recommendations based on user interactions and preferences
- **API-First Design**: RESTful endpoints for seamless integration with frontend and backend services

## Structure

- **models/**: Contains machine learning models for content classification and recommendation
  - **classifier_model.py**: Tech content classification using traditional ML and transformers
- **api/**: FastAPI route definitions and endpoint handlers
  - **ml_routes.py**: API endpoints for ML-based content filtering and recommendations
- **utils/**: Helper functions and utility classes
  - **logger.py**: Logging utilities for the ML API
- **config/**: Configuration files for ML models and API settings
- **tests/**: Unit and integration tests for the ML API
- **saved_models/**: Directory for storing trained model weights (created at runtime)
- **logs/**: Log files from the API (created at runtime)

## Manual Setup Steps

Before running the API, you need to complete these manual steps:

1. **Create necessary directories**:
   ```
   mkdir -p saved_models logs temp
   ```

2. **Set up environment variables** (create a `.env` file in the ml_api directory):
   ```
   # .env file
   DEBUG=True
   MODEL_PATH=./saved_models
   LOG_LEVEL=INFO
   ```

3. **Make sure Python 3.8+ is installed** with pip for package management

4. **If using GPU acceleration** for transformers, ensure you have the appropriate CUDA drivers installed

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Start the development server:
   ```
   uvicorn main:app --reload
   ```

## API Endpoints

- `/api/ml/classify`: Classify text content into tech categories
- `/api/ml/analyze/video`: Analyze video content (title, description, transcript)
- `/api/ml/analyze/article`: Analyze article content
- `/api/ml/user/interaction`: Process user interactions with content
- `/api/ml/recommend`: Get personalized content recommendations
- `/api/ml/categories`: Get list of all tech categories
- `/classify`: Root endpoint for quick text classification
- `/categories`: Get all available tech categories

## Technologies Used

- **FastAPI**: High-performance web framework for building APIs
- **scikit-learn**: Traditional ML models (TF-IDF, SVM)
- **Transformers**: State-of-the-art NLP models
- **PyTorch**: Deep learning framework for transformer models
- **Sentence Transformers**: Text embeddings for similarity-based classification

## Documentation

API documentation is automatically generated at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`