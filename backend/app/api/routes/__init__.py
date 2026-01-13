"""API routes package initialization."""
from .prediction import router as prediction_router
from .model import router as model_router

__all__ = ["prediction_router", "model_router"]
