"""
Model loader module.
Handles loading of ML models, encoders, and metadata at application startup.
"""

import pickle
import json
import os
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
    
    def _resolve_path(self, path: str) -> Path:
        """
        Resolve and validate file path.
        Converts to absolute path if relative, validates existence.
        """
        file_path = Path(path)
        
        # If path is not absolute, make it absolute
        if not file_path.is_absolute():
            # Try relative to current working directory
            cwd_path = Path.cwd() / file_path
            if cwd_path.exists():
                file_path = cwd_path
            else:
                # Try relative to this file's parent directories
                backend_dir = Path(__file__).resolve().parent.parent.parent
                alt_path = backend_dir / file_path
                if alt_path.exists():
                    file_path = alt_path
        
        # Log the resolved path
        logger.info(f"📂 Resolved path: {file_path.absolute()}")
        logger.info(f"   Exists: {file_path.exists()}")
        logger.info(f"   CWD: {Path.cwd()}")
        
        return file_path
    
    def load_model(self, model_path: str) -> None:
        """Load the XGBoost model from pickle file."""
        try:
            resolved_path = self._resolve_path(model_path)
            
            if not resolved_path.exists():
                logger.error(f"❌ Model file not found at: {resolved_path}")
                logger.error(f"   Original path: {model_path}")
                logger.error(f"   Current directory: {Path.cwd()}")
                logger.error(f"   Directory contents: {list(Path.cwd().iterdir())}")
                raise FileNotFoundError(f"Model file not found: {resolved_path}")
            
            with open(resolved_path, 'rb') as f:
                self._model = pickle.load(f)
            
            logger.info(f"✅ Model loaded successfully from {resolved_path}")
            logger.info(f"   Model type: {type(self._model).__name__}")
        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            logger.exception("Full traceback:")
            raise RuntimeError(f"Model loading failed: {e}")
    
    def load_encoder(self, encoder_path: str) -> None:
        """Load the label encoder from pickle file."""
        try:
            resolved_path = self._resolve_path(encoder_path)
            
            if not resolved_path.exists():
                logger.error(f"❌ Encoder file not found at: {resolved_path}")
                raise FileNotFoundError(f"Encoder file not found: {resolved_path}")
            
            with open(resolved_path, 'rb') as f:
                self._encoder = pickle.load(f)
            
            logger.info(f"✅ Encoder loaded successfully from {resolved_path}")
        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"❌ Failed to load encoder: {e}")
            logger.exception("Full traceback:")
            raise RuntimeError(f"Encoder loading failed: {e}")
    
    def load_metadata(self, metadata_path: str) -> None:
        """Load model metadata from JSON file."""
        try:
            resolved_path = self._resolve_path(metadata_path)
            
            if not resolved_path.exists():
                logger.error(f"❌ Metadata file not found at: {resolved_path}")
                raise FileNotFoundError(f"Metadata file not found: {resolved_path}")
            
            with open(resolved_path, 'r') as f:
                self._metadata = json.load(f)
            
            logger.info(f"✅ Metadata loaded successfully from {resolved_path}")
        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"❌ Failed to load metadata: {e}")
            logger.exception("Full traceback:")
            raise RuntimeError(f"Metadata loading failed: {e}")
    
    def load_feature_importance(self, feature_importance_path: str) -> None:
        """Load feature importance from JSON file."""
        try:
            resolved_path = self._resolve_path(feature_importance_path)
            
            if not resolved_path.exists():
                logger.error(f"❌ Feature importance file not found at: {resolved_path}")
                raise FileNotFoundError(f"Feature importance file not found: {resolved_path}")
            
            with open(feature_importance_path, 'r') as f:
                self._feature_importance = json.load(f)
            
            logger.info(f"✅ Feature importance loaded from {resolved_path}")
        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"❌ Failed to load feature importance: {e}")
            logger.exception("Full traceback:")
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
