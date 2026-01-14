"""
Core configuration module for the fraud detection API.
Loads environment variables and provides application settings.
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_title: str = "Fraud Detection API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = int(os.getenv("PORT", 8000))
    debug: bool = os.getenv("ENVIRONMENT", "development") != "production"
    env: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS Configuration - Allow all origins for Render deployment
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.onrender.com",  # Render frontend
        "*"  # Allow all for production (can be restricted later)
    ]
    
    @property
    def models_dir(self) -> Path:
        """
        Get the absolute path to the models directory.
        Works in local development, Docker, and Render.
        Priority: MODEL_DIR env var > /app/models (Docker/Render) > relative path (local)
        """
        # Check if MODEL_DIR environment variable is set
        model_dir_env = os.getenv("MODEL_DIR")
        if model_dir_env:
            return Path(model_dir_env)
        
        # Check if running in Docker/Render (/app/models)
        docker_models_path = Path("/app/models")
        if docker_models_path.exists():
            return docker_models_path
        
        # Fall back to relative path from project root (local development)
        # Get path relative to this config.py file: backend/app/core/config.py
        # Navigate up to backend/ then to models/
        backend_dir = Path(__file__).resolve().parent.parent.parent
        return backend_dir / "models"
    
    @property
    def model_path(self) -> str:
        """Full path to the XGBoost model file."""
        model_file = os.getenv("MODEL_FILE", "fraud_detection_xgboost_v1.pkl")
        return str(self.models_dir / model_file)
    
    @property
    def encoder_path(self) -> str:
        """Full path to the label encoder file."""
        encoder_file = os.getenv("ENCODER_FILE", "label_encoder.pkl")
        return str(self.models_dir / encoder_file)
    
    @property
    def metadata_path(self) -> str:
        """Full path to the model metadata file."""
        metadata_file = os.getenv("METADATA_FILE", "model_metadata.json")
        return str(self.models_dir / metadata_file)
    
    @property
    def feature_importance_path(self) -> str:
        """Full path to the feature importance file."""
        feature_importance_file = os.getenv("FEATURE_IMPORTANCE_FILE", "feature_importance.json")
        return str(self.models_dir / feature_importance_file)
    
    # Risk Thresholds
    high_risk_threshold: float = 0.8
    medium_risk_threshold: float = 0.4
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Using lru_cache ensures settings are loaded only once.
    """
    return Settings()
