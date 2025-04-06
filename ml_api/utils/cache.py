"""
Caching utility for the ML API

Implements caching for expensive operations like model inference
to improve performance and reduce unnecessary processing.
"""

import functools
import hashlib
import json
import os
import pickle
import time
from pathlib import Path
from typing import Any, Callable, Dict, Optional, Tuple, Union

from utils.logger import get_logger

logger = get_logger(__name__)

# Create cache directory if it doesn't exist
CACHE_DIR = Path(__file__).parent.parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

# Default cache expiration time (in seconds)
DEFAULT_EXPIRATION = 60 * 60 * 24  # 24 hours

class Cache:
    """
    Simple file-based cache implementation for ML API results
    """
    
    @staticmethod
    def _get_cache_key(func: Callable, *args, **kwargs) -> str:
        """
        Generate a unique cache key from function name and arguments
        
        Args:
            func: The function being cached
            *args: Positional arguments to the function
            **kwargs: Keyword arguments to the function
            
        Returns:
            str: A hash key representing the function call
        """
        # Create a string representation of the function and its arguments
        func_repr = func.__name__
        args_repr = str(args)
        kwargs_repr = str(sorted(kwargs.items()))
        
        # Create a hash of the combined string
        key_string = f"{func_repr}:{args_repr}:{kwargs_repr}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    @staticmethod
    def _get_cache_path(key: str) -> Path:
        """
        Get the file path for a cache key
        
        Args:
            key: The cache key
            
        Returns:
            Path: Path to the cache file
        """
        return CACHE_DIR / f"{key}.pkl"
    
    @staticmethod
    def get(key: str) -> Tuple[bool, Any]:
        """
        Get a value from the cache
        
        Args:
            key: The cache key
            
        Returns:
            Tuple[bool, Any]: (found, value) pair, where found is True if the 
                             key exists and hasn't expired
        """
        cache_path = Cache._get_cache_path(key)
        
        if not cache_path.exists():
            return False, None
        
        try:
            with open(cache_path, 'rb') as f:
                expiration, value = pickle.load(f)
            
            # Check if the cache has expired
            if expiration < time.time():
                # Remove expired cache
                os.remove(cache_path)
                return False, None
            
            return True, value
        except Exception as e:
            logger.error(f"Error reading from cache: {str(e)}")
            # Remove corrupt cache file
            if cache_path.exists():
                os.remove(cache_path)
            return False, None
    
    @staticmethod
    def set(key: str, value: Any, expiration: int = DEFAULT_EXPIRATION) -> None:
        """
        Set a value in the cache
        
        Args:
            key: The cache key
            value: The value to cache
            expiration: Time in seconds until the cache expires
        """
        cache_path = Cache._get_cache_path(key)
        
        try:
            # Calculate expiration timestamp
            expiration_time = time.time() + expiration
            
            with open(cache_path, 'wb') as f:
                pickle.dump((expiration_time, value), f)
        except Exception as e:
            logger.error(f"Error writing to cache: {str(e)}")
    
    @staticmethod
    def delete(key: str) -> bool:
        """
        Delete a value from the cache
        
        Args:
            key: The cache key
            
        Returns:
            bool: True if the key was deleted, False otherwise
        """
        cache_path = Cache._get_cache_path(key)
        
        if cache_path.exists():
            try:
                os.remove(cache_path)
                return True
            except Exception as e:
                logger.error(f"Error deleting cache: {str(e)}")
        
        return False
    
    @staticmethod
    def clear() -> None:
        """
        Clear all cached values
        """
        try:
            for cache_file in CACHE_DIR.glob("*.pkl"):
                os.remove(cache_file)
        except Exception as e:
            logger.error(f"Error clearing cache: {str(e)}")


def cached(expiration: int = DEFAULT_EXPIRATION):
    """
    Decorator to cache function results
    
    Args:
        expiration: Time in seconds until the cache expires
        
    Returns:
        Callable: Decorated function with caching
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function and arguments
            cache_key = Cache._get_cache_key(func, *args, **kwargs)
            
            # Check if result is in cache
            found, cached_result = Cache.get(cache_key)
            
            if found:
                logger.debug(f"Cache hit for {func.__name__}")
                return cached_result
            
            # Not in cache, execute function
            logger.debug(f"Cache miss for {func.__name__}")
            result = func(*args, **kwargs)
            
            # Store result in cache
            Cache.set(cache_key, result, expiration)
            
            return result
        return wrapper
    return decorator
