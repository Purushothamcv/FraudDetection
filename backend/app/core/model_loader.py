"""
Model loader module.
Handles loading of ML models, encoders, and metadata at application startup.
"""

import pickle
import json
from pathlib import Path
from typing import Dict, Any
from loguru import logger


class ModelLoader:
    """
    Singleton class to load and manage ML models and artifacts.
    Models are loaded once at application startup for efficiency.
    """
    
    _instance = None
    _model = None
    _encoder = None
    _metadata = None
    _feature_importance = None
    
    def __new__(cls):
        """Implement singleton pattern."""
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance
    
    def load_model(self, model_path: str) -> None:
        """Load the XGBoost model from pickle file."""
        try:
            with open(model_path, 'rb') as f:
                self._model = pickle.load(f)
            logger.info(f"✅ Model loaded successfully from {model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise RuntimeError(f"Model loading failed: {e}")
    
    def load_encoder(self, encoder_path: str) -> None:
        """Load the label encoder from pickle file."""
        try:
            with open(encoder_path, 'rb') as f:
                self._encoder = pickle.load(f)
            logger.info(f"✅ Encoder loaded successfully from {encoder_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load encoder: {e}")
            raise RuntimeError(f"Encoder loading failed: {e}")
    
    def load_metadata(self, metadata_path: str) -> None:
        """Load model metadata from JSON file."""
        try:
            with open(metadata_path, 'r') as f:
                self._metadata = json.load(f)
            logger.info(f"✅ Metadata loaded successfully from {metadata_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load metadata: {e}")
            raise RuntimeError(f"Metadata loading failed: {e}")
    
    def load_feature_importance(self, feature_importance_path: str) -> None:
        """Load feature importance from JSON file."""
        try:
            with open(feature_importance_path, 'r') as f:
                self._feature_importance = json.load(f)
            logger.info(f"✅ Feature importance loaded from {feature_importance_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load feature importance: {e}")
            raise RuntimeError(f"Feature importance loading failed: {e}")
    
    def load_all(
        self,
        model_path: str,
        encoder_path: str,
        metadata_path: str,
        feature_importance_path: str
    ) -> None:
        """Load all model artifacts."""
        logger.info("🚀 Loading all model artifacts...")
        self.load_model(model_path)
        self.load_encoder(encoder_path)
        self.load_metadata(metadata_path)
        self.load_feature_importance(feature_importance_path)
        logger.info("✅ All artifacts loaded successfully!")
    
    @property
    def model(self):
        """Get the loaded model."""
        if self._model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        return self._model
    
    @property
    def encoder(self):
        """Get the loaded encoder."""
        if self._encoder is None:
            raise RuntimeError("Encoder not loaded. Call load_encoder() first.")
        return self._encoder
    
    @property
    def metadata(self) -> Dict[str, Any]:
        """Get the loaded metadata."""
        if self._metadata is None:
            raise RuntimeError("Metadata not loaded. Call load_metadata() first.")
        return self._metadata
    
    @property
    def feature_importance(self) -> Dict[str, Any]:
        """Get the loaded feature importance."""
        if self._feature_importance is None:
            raise RuntimeError("Feature importance not loaded.")
        return self._feature_importance
    
    def is_loaded(self) -> bool:
        """Check if all artifacts are loaded."""
        return all([
            self._model is not None,
            self._encoder is not None,
            self._metadata is not None,
            self._feature_importance is not None
        ])


# Global instance
model_loader = ModelLoader()
