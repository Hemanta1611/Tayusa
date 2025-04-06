import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, List
import time
import os
from dotenv import load_dotenv

# Import API routes
from api.ml_routes import router as ml_router

# Import utilities and models
from utils.logger import get_logger, configure_logging
from models.classifier_model import TechContentClassifier, TECH_CATEGORIES

# Load environment variables
load_dotenv()

# Initialize logger
logger = get_logger(__name__)

app = FastAPI(
    title="Tayusa ML API",
    description="Machine Learning API for Tayusa Tech Learning Platform",
    version="1.0.0",
    docs_url=None  # Disable default docs to use custom documentation
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
configure_logging()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize models
tech_classifier = TechContentClassifier(model_type="traditional")

# Include routers
app.include_router(ml_router, prefix="/api/ml", tags=["ML Operations"])

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Log request details
    status_code = response.status_code
    logger.info(
        f"Request: {request.method} {request.url.path} -> {status_code} ({process_time:.4f}s)"
    )
    
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {"classifier": "online"}}

# Custom OpenAPI docs
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Tayusa ML API Documentation",
        swagger_favicon_url="/static/favicon.ico",
    )

# Root endpoint redirecting to docs
@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return HTMLResponse(
        """
        <html>
            <head>
                <meta http-equiv="refresh" content="0; url=/docs" />
                <title>Redirecting to docs</title>
            </head>
            <body>
                <p>Redirecting to <a href="/docs">documentation</a>...</p>
            </body>
        </html>
        """
    )

# Basic classification endpoint
class TextClassificationRequest(BaseModel):
    text: str
    threshold: Optional[float] = 0.5
    top_k: Optional[int] = 5

@app.post("/classify", response_model=Dict[str, float])
async def classify_text(request: TextClassificationRequest):
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

@app.get("/categories")
async def get_categories():
    """
    Get all available tech categories for classification.
    """
    return {
        "categories": TECH_CATEGORIES,
        "count": len(TECH_CATEGORIES)
    }

# Handle model loading during startup
@app.on_event("startup")
async def startup_event():
    logger.info("ML API Starting...")
    
    # Create cache directory if it doesn't exist
    cache_dir = os.path.join(os.path.dirname(__file__), "cache")
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
        logger.info(f"Created cache directory at {cache_dir}")
    
    # Initialize any resources needed at startup
    logger.info("ML API Started Successfully")

# Handle cleanup during shutdown
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ML API Shutting Down...")
    # Clean up any resources
    logger.info("ML API Shutdown Complete")

if __name__ == "__main__":
    # Start server with hot reload for development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
