from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Body
from typing import Optional, List, Dict, Any
import os
from pydantic import BaseModel
import json

# Import models
from models.classifier_model import TechContentClassifier, ContentRecommender, TECH_CATEGORIES
from utils.logger import get_logger
from utils.cache import cached

router = APIRouter()
logger = get_logger(__name__)

# Initialize models
tech_classifier = TechContentClassifier(model_type="traditional")
content_recommender = ContentRecommender(classifier=tech_classifier)

# Pydantic models for request validation
class TextAnalysisRequest(BaseModel):
    text: str
    threshold: Optional[float] = 0.5
    top_k: Optional[int] = 5

class VideoAnalysisRequest(BaseModel):
    video_id: str
    title: Optional[str] = None
    description: Optional[str] = None
    transcript: Optional[str] = None
    threshold: Optional[float] = 0.5

class ArticleAnalysisRequest(BaseModel):
    title: str
    content: str
    threshold: Optional[float] = 0.5

class UserInteractionRequest(BaseModel):
    user_id: str
    content_id: str
    content_type: str  # video, article, short
    title: Optional[str] = None
    description: Optional[str] = None
    text: Optional[str] = None
    interaction_type: str  # view, like, comment, share, save, dislike

class RecommendationRequest(BaseModel):
    user_id: str
    count: Optional[int] = 10
    content_pool: Optional[List[Dict[str, Any]]] = None

@router.post("/classify", response_model=Dict[str, float])
@cached(expiration=3600)  # Cache classification results for 1 hour
async def classify_text(request: TextAnalysisRequest):
    """
    Classify text content into tech categories.
    
    Returns a dictionary of category -> confidence score
    """
    try:
        result = tech_classifier.predict(
            request.text, 
            threshold=request.threshold,
            top_k=request.top_k
        )
        return result
    except Exception as e:
        logger.error(f"Text classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")

@router.post("/analyze/video")
@cached(expiration=3600)  # Cache video analysis for 1 hour
async def analyze_video(request: VideoAnalysisRequest):
    """
    Analyze a video to determine its tech categories.
    Uses title, description, and transcript for classification.
    """
    try:
        # Combine all available text for classification
        combined_text = ""
        if request.title:
            combined_text += f"Title: {request.title}\n"
        if request.description:
            combined_text += f"Description: {request.description}\n"
        if request.transcript:
            combined_text += f"Transcript: {request.transcript}"
        
        # If we don't have any text, return empty
        if not combined_text.strip():
            return {
                "categories": {},
                "primary_category": None,
                "confidence": 0.0,
                "is_tech_content": False,
                "status": "error",
                "message": "No text content provided for analysis"
            }
        
        # Classify the content
        categories = tech_classifier.predict(combined_text, threshold=request.threshold)
        
        # Determine primary category if any
        primary_category = None
        max_confidence = 0.0
        
        if categories:
            primary_category, max_confidence = max(categories.items(), key=lambda x: x[1])
        
        return {
            "categories": categories,
            "primary_category": primary_category,
            "confidence": max_confidence,
            "is_tech_content": bool(categories),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Video analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Video analysis error: {str(e)}")

@router.post("/analyze/article")
@cached(expiration=3600)  # Cache article analysis for 1 hour
async def analyze_article(request: ArticleAnalysisRequest):
    """
    Analyze an article to determine its tech categories.
    """
    try:
        # Combine title and content for classification
        combined_text = f"Title: {request.title}\nContent: {request.content}"
        
        # Classify the content
        categories = tech_classifier.predict(combined_text, threshold=request.threshold)
        
        # Determine primary category if any
        primary_category = None
        max_confidence = 0.0
        
        if categories:
            primary_category, max_confidence = max(categories.items(), key=lambda x: x[1])
        
        return {
            "categories": categories,
            "primary_category": primary_category,
            "confidence": max_confidence,
            "is_tech_content": bool(categories),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Article analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Article analysis error: {str(e)}")

@router.post("/user/interaction")
async def process_user_interaction(request: UserInteractionRequest):
    """
    Process a user interaction with content and update their profile for recommendations.
    """
    try:
        # Combine all available text for the content
        content_text = ""
        if request.title:
            content_text += f"Title: {request.title}\n"
        if request.description:
            content_text += f"Description: {request.description}\n"
        if request.text:
            content_text += f"Content: {request.text}"
        
        # Create interaction data
        interaction = {
            "text": content_text,
            "interaction_type": request.interaction_type,
            "content_id": request.content_id,
            "content_type": request.content_type
        }
        
        # Update user profile
        content_recommender.update_user_profile(request.user_id, interaction)
        
        return {
            "status": "success",
            "message": f"Updated user profile for {request.user_id}"
        }
    except Exception as e:
        logger.error(f"User interaction processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"User interaction error: {str(e)}")

@router.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    """
    Get content recommendations for a specific user.
    
    If content_pool is provided, recommendations are filtered from that pool.
    Otherwise, returns recommendations from a predefined list (in a production environment, 
    this would query a database for available content).
    """
    try:
        # If content pool is not provided, use a default pool
        if not request.content_pool:
            # This would typically fetch from a database
            request.content_pool = [
                {
                    "id": "vid123", 
                    "type": "video", 
                    "title": "Introduction to Python Programming", 
                    "description": "Learn the basics of Python programming language"
                },
                {
                    "id": "art456", 
                    "type": "article", 
                    "title": "Advanced React Hooks", 
                    "description": "Deep dive into React hooks and how to use them effectively"
                },
                {
                    "id": "vid789", 
                    "type": "short", 
                    "title": "Quick Git Tips", 
                    "description": "Essential git commands every developer should know"
                },
                {
                    "id": "art101", 
                    "type": "article", 
                    "title": "Introduction to Machine Learning", 
                    "description": "Understanding the basics of machine learning algorithms"
                },
                {
                    "id": "vid102", 
                    "type": "video", 
                    "title": "Building RESTful APIs", 
                    "description": "How to design and implement robust REST APIs"
                }
            ]
        
        # Get recommendations
        recommendations = content_recommender.get_recommendations(
            request.user_id, 
            request.content_pool,
            request.count
        )
        
        return {
            "user_id": request.user_id,
            "recommendations": recommendations,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@router.get("/categories")
@cached(expiration=86400)  # Cache categories for 24 hours
async def get_categories():
    """
    Get the list of all tech categories the system can classify.
    """
    return {
        "categories": TECH_CATEGORIES,
        "count": len(TECH_CATEGORIES),
        "status": "success"
    }
