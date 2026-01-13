"""
Core configuration module for the fraud detection API.
Loads environment variables and provides application settings.
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_title: str = "Fraud Detection API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    env: str = "development"
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # Model Paths
    model_path: str = "models/fraud_detection_xgboost_v1.pkl"
    encoder_path: str = "models/label_encoder.pkl"
    metadata_path: str = "models/model_metadata.json"
    feature_importance_path: str = "models/feature_importance.json"
    
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
