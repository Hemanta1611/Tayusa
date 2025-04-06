"""
Tech Content Classification Model

This module contains the implementation of a multi-label classifier for tech content.
It can classify content into various tech categories like Python, JavaScript, Web Development, etc.
"""

import os
import numpy as np
import pandas as pd
import pickle
import joblib
from typing import List, Dict, Union, Optional
from pathlib import Path

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import LinearSVC
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import f1_score, precision_score, recall_score

# For deep learning based classification
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer

# Local imports
from utils.logger import get_logger

logger = get_logger(__name__)

# Define the path to save and load models
MODEL_DIR = Path(__file__).parent.parent / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)

# Define tech categories
TECH_CATEGORIES = [
    "Python", "JavaScript", "Java", "C#", "C++", "Go", "Rust", "PHP", "Swift", "Kotlin",
    "Web Development", "Mobile Development", "Data Science", "Machine Learning", "DevOps",
    "Cloud Computing", "Cybersecurity", "Blockchain", "IoT", "Augmented Reality",
    "Virtual Reality", "Frontend", "Backend", "Fullstack", "Database",
    "UI/UX Design", "Testing", "Game Development", "Microservices", "Artificial Intelligence"
]


class TechContentClassifier:
    """
    A classifier for tech content using both traditional ML and transformer-based approaches.
    """
    
    def __init__(self, model_type: str = "transformer"):
        """
        Initialize the tech content classifier.
        
        Args:
            model_type (str): Type of model to use, either "traditional" or "transformer"
        """
        self.model_type = model_type
        self.model = None
        self.tokenizer = None
        self.label_binarizer = MultiLabelBinarizer()
        self.label_binarizer.fit([TECH_CATEGORIES])
        
        # Dictionary to map integer indices to category names
        self.idx_to_category = {i: category for i, category in enumerate(TECH_CATEGORIES)}
        
        if model_type == "traditional":
            self._init_traditional_model()
        else:
            self._init_transformer_model()
    
    def _init_traditional_model(self):
        """
        Initialize a traditional ML model (TF-IDF + LinearSVC).
        """
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=10000, ngram_range=(1, 2))),
            ('classifier', OneVsRestClassifier(LinearSVC(C=1.0, class_weight='balanced')))
        ])
    
    def _init_transformer_model(self):
        """
        Initialize a transformer-based model.
        """
        try:
            # Try to load a fine-tuned model specific to tech content
            model_path = MODEL_DIR / "tech_classifier_transformer"
            if model_path.exists():
                self.model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
                self.tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            else:
                # Fall back to a pre-trained model
                self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
                # We'll use the sentence embeddings for similarity-based classification
                logger.info("Using sentence transformer for embedding-based classification")
        except Exception as e:
            logger.error(f"Error loading transformer model: {e}")
            logger.info("Falling back to traditional model")
            self.model_type = "traditional"
            self._init_traditional_model()
    
    def train(self, texts: List[str], labels: List[List[str]], validation_split: float = 0.2):
        """
        Train the classifier on the provided texts and labels.
        
        Args:
            texts (List[str]): List of text content
            labels (List[List[str]]): List of lists containing category labels
            validation_split (float): Portion of data to use for validation
        
        Returns:
            Dict: Training metrics
        """
        # Convert string labels to binary matrix
        y = self.label_binarizer.transform(labels)
        
        # Split data for training and validation
        n_samples = len(texts)
        n_val = int(n_samples * validation_split)
        indices = np.random.permutation(n_samples)
        train_idx, val_idx = indices[n_val:], indices[:n_val]
        
        X_train, y_train = [texts[i] for i in train_idx], y[train_idx]
        X_val, y_val = [texts[i] for i in val_idx], y[val_idx]
        
        if self.model_type == "traditional":
            # Train traditional ML model
            self.model.fit(X_train, y_train)
            
            # Evaluate on validation set
            y_pred = self.model.predict(X_val)
            
            # Calculate metrics
            metrics = {
                'f1': f1_score(y_val, y_pred, average='micro'),
                'precision': precision_score(y_val, y_pred, average='micro'),
                'recall': recall_score(y_val, y_pred, average='micro')
            }
            
            # Save the model
            joblib.dump(self.model, MODEL_DIR / "tech_classifier_traditional.joblib")
            
        else:
            # For transformer model, we would typically fine-tune it
            # This is a simplified version; actual fine-tuning would be more complex
            logger.info("Transformer model fine-tuning not implemented in this version")
            metrics = {"info": "Transformer model training not implemented in this version"}
        
        return metrics
    
    def predict(self, text: str, threshold: float = 0.5, top_k: Optional[int] = None) -> Dict[str, float]:
        """
        Predict tech categories for the given text.
        
        Args:
            text (str): The text to classify
            threshold (float): Confidence threshold for including a category
            top_k (int, optional): Return only top k predictions
        
        Returns:
            Dict[str, float]: Dictionary mapping category names to confidence scores
        """
        if not text or text.strip() == "":
            return {}
        
        if self.model_type == "traditional":
            # For traditional model
            y_pred = self.model.predict_proba([text])[0]
            
            # Map probabilities to categories
            predictions = {
                self.idx_to_category[i]: float(prob)
                for i, prob in enumerate(y_pred) if prob >= threshold
            }
        else:
            # For transformer model
            if isinstance(self.model, SentenceTransformer):
                # Using sentence transformer for similarity-based classification
                # This is a simplified approach
                text_embedding = self.model.encode(text, convert_to_tensor=True)
                
                # Compute similarity with category embeddings
                # In a real implementation, we'd have pre-computed embeddings for categories
                # or a more sophisticated approach
                category_embeddings = self.model.encode(TECH_CATEGORIES, convert_to_tensor=True)
                
                # Compute cosine similarity
                similarities = torch.nn.functional.cosine_similarity(
                    text_embedding.unsqueeze(0), category_embeddings
                ).tolist()
                
                # Map similarities to categories
                predictions = {
                    category: float(sim)
                    for category, sim in zip(TECH_CATEGORIES, similarities) if sim >= threshold
                }
            else:
                # Using a fine-tuned classifier
                inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
                with torch.no_grad():
                    outputs = self.model(**inputs)
                
                probabilities = torch.sigmoid(outputs.logits).squeeze().tolist()
                
                # Map probabilities to categories
                predictions = {
                    self.idx_to_category[i]: float(prob)
                    for i, prob in enumerate(probabilities) if prob >= threshold
                }
        
        # Sort by confidence score (descending)
        predictions = dict(sorted(predictions.items(), key=lambda x: x[1], reverse=True))
        
        # Return only top k if specified
        if top_k and len(predictions) > top_k:
            predictions = dict(list(predictions.items())[:top_k])
        
        return predictions
    
    def save(self, path: Optional[str] = None):
        """
        Save the model to disk.
        
        Args:
            path (str, optional): Path to save the model. If None, use the default path.
        """
        if not path:
            path = MODEL_DIR / f"tech_classifier_{self.model_type}"
        
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        if self.model_type == "traditional":
            joblib.dump(self.model, path)
        else:
            if hasattr(self.model, 'save_pretrained'):
                self.model.save_pretrained(path)
                self.tokenizer.save_pretrained(path)
            else:
                logger.warning("Cannot save this type of transformer model directly")
    
    def load(self, path: Optional[str] = None):
        """
        Load the model from disk.
        
        Args:
            path (str, optional): Path to load the model from. If None, use the default path.
        """
        if not path:
            path = MODEL_DIR / f"tech_classifier_{self.model_type}"
        
        if self.model_type == "traditional":
            try:
                self.model = joblib.load(path)
            except Exception as e:
                logger.error(f"Error loading traditional model: {e}")
                self._init_traditional_model()
        else:
            try:
                self.model = AutoModelForSequenceClassification.from_pretrained(path)
                self.tokenizer = AutoTokenizer.from_pretrained(path)
            except Exception as e:
                logger.error(f"Error loading transformer model: {e}")
                self._init_transformer_model()


class ContentRecommender:
    """
    A recommender system for tech content based on user preferences.
    """
    
    def __init__(self, classifier: TechContentClassifier = None):
        """
        Initialize the content recommender.
        
        Args:
            classifier (TechContentClassifier, optional): Classifier to use for content analysis
        """
        self.classifier = classifier or TechContentClassifier()
        self.user_profiles = {}  # Maps user_id to their interest profile
    
    def update_user_profile(self, user_id: str, content_interaction: Dict):
        """
        Update a user's profile based on their content interaction.
        
        Args:
            user_id (str): User ID
            content_interaction (Dict): Details of the content interaction
        """
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {category: 0.0 for category in TECH_CATEGORIES}
        
        content_text = content_interaction.get('text', '')
        interaction_type = content_interaction.get('interaction_type', 'view')
        
        # Get content categories
        categories = self.classifier.predict(content_text)
        
        # Update weights based on interaction type
        weight = self._get_interaction_weight(interaction_type)
        
        # Update user profile
        for category, confidence in categories.items():
            if category in self.user_profiles[user_id]:
                # Gradually update the profile using weighted average
                current_weight = self.user_profiles[user_id][category]
                self.user_profiles[user_id][category] = (
                    0.8 * current_weight + 0.2 * confidence * weight
                )
    
    def _get_interaction_weight(self, interaction_type: str) -> float:
        """
        Get weight for different types of interactions.
        
        Args:
            interaction_type (str): Type of interaction (view, like, comment, share, etc.)
            
        Returns:
            float: Weight value
        """
        weights = {
            'view': 0.5,
            'like': 1.0,
            'comment': 1.2,
            'share': 1.5,
            'save': 1.3,
            'dislike': -0.5
        }
        
        return weights.get(interaction_type.lower(), 0.5)
    
    def get_recommendations(self, user_id: str, content_items: List[Dict], 
                           num_recommendations: int = 10) -> List[Dict]:
        """
        Get content recommendations for a user.
        
        Args:
            user_id (str): User ID
            content_items (List[Dict]): Pool of content items to recommend from
            num_recommendations (int): Number of recommendations to return
            
        Returns:
            List[Dict]: Recommended content items
        """
        if user_id not in self.user_profiles:
            # No profile, return random recommendations
            import random
            return random.sample(content_items, min(num_recommendations, len(content_items)))
        
        user_profile = self.user_profiles[user_id]
        
        # Calculate scores for each content item
        scored_items = []
        for item in content_items:
            text = item.get('title', '') + ' ' + item.get('description', '')
            categories = self.classifier.predict(text)
            
            # Calculate similarity score with user profile
            score = 0
            for category, confidence in categories.items():
                if category in user_profile:
                    score += confidence * user_profile[category]
            
            scored_items.append((item, score))
        
        # Sort by score (descending)
        scored_items.sort(key=lambda x: x[1], reverse=True)
        
        # Return top N items
        return [item for item, _ in scored_items[:num_recommendations]]


# Example usage
def example_usage():
    # Initialize classifier
    classifier = TechContentClassifier(model_type="traditional")
    
    # Example text
    text = """
    This tutorial explains how to use React hooks with TypeScript to build web applications.
    We'll cover useState, useEffect, and custom hooks with proper typing.
    """
    
    # Predict categories
    categories = classifier.predict(text, threshold=0.3)
    print(f"Predicted categories: {categories}")
    
    # Initialize recommender
    recommender = ContentRecommender(classifier=classifier)
    
    # Update user profile based on interaction
    recommender.update_user_profile(
        "user123",
        {
            "text": text,
            "interaction_type": "like"
        }
    )
    
    # Get recommendations
    content_pool = [
        {"id": "1", "title": "Python Data Science Tutorial", "description": "Learn pandas and numpy"},
        {"id": "2", "title": "Advanced React Patterns", "description": "Component composition in React"},
        {"id": "3", "title": "Machine Learning with PyTorch", "description": "Build neural networks"}
    ]
    
    recommendations = recommender.get_recommendations("user123", content_pool)
    print(f"Recommendations: {recommendations}")


if __name__ == "__main__":
    example_usage()
