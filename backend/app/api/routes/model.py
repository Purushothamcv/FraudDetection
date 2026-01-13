"""Model information API routes."""
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from loguru import logger

from app.schemas.response import (
    ModelInfoResponse,
    FeatureImportanceResponse,
    HealthCheckResponse,
    ErrorResponse
)
from app.core.model_loader import model_loader
from app.core.config import get_settings

router = APIRouter(prefix="/model", tags=["model"])


@router.get(
    "/info",
    response_model=ModelInfoResponse,
    status_code=status.HTTP_200_OK,
    summary="Get model information",
    description="Retrieve comprehensive information about the loaded fraud detection model",
    responses={
        200: {"description": "Model information retrieved successfully"},
        500: {"model": ErrorResponse, "description": "Failed to retrieve model info"}
    }
)
async def get_model_info() -> Dict[str, Any]:
    """
    Get information about the loaded model including version, metrics, and configuration.
    
    Returns:
        Model metadata including version, performance metrics, and training info
        
    Raises:
        HTTPException: If model info cannot be retrieved
    """
    try:
        logger.info("Retrieving model information")
        
        metadata = model_loader.metadata
        settings = get_settings()
        
        return {
            "model_version": metadata.get("version", "1.0"),
            "model_type": metadata.get("model_type", "XGBoost Classifier"),
            "training_date": metadata.get("training_date", "2026-01-13"),
            "performance_metrics": metadata.get("performance_metrics", {}),
            "features": metadata.get("features", []),
            "hyperparameters": metadata.get("hyperparameters", {}),
            "training_data_size": metadata.get("training_samples", 5090096)
        }
        
    except Exception as e:
        logger.error(f"Error retrieving model info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to retrieve model information", "message": str(e)}
        )


@router.get(
    "/feature-importance",
    response_model=FeatureImportanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Get feature importance",
    description="Retrieve feature importance scores from the trained model",
    responses={
        200: {"description": "Feature importance retrieved successfully"},
        500: {"model": ErrorResponse, "description": "Failed to retrieve feature importance"}
    }
)
async def get_feature_importance() -> Dict[str, Any]:
    """
    Get feature importance scores showing which features contribute most to predictions.
    
    Returns:
        Feature importance data sorted by importance score
        
    Raises:
        HTTPException: If feature importance cannot be retrieved
    """
    try:
        logger.info("Retrieving feature importance")
        
        feature_importance_data = model_loader.feature_importance
        
        # Extract data from JSON structure
        features = feature_importance_data.get("features", [])
        importance = feature_importance_data.get("importance", [])
        importance_percentage = feature_importance_data.get("importance_percentage", [])
        
        # Create sorted indices by importance (descending)
        sorted_indices = sorted(range(len(importance_percentage)), 
                              key=lambda i: importance_percentage[i], 
                              reverse=True)
        
        # Reorder all lists according to sorted indices
        sorted_features = [features[i] for i in sorted_indices]
        sorted_importance = [importance[i] for i in sorted_indices]
        sorted_importance_pct = [importance_percentage[i] for i in sorted_indices]
        
        # Get top 5 features with their percentages
        top_5_count = min(5, len(sorted_features))
        top_features = {
            sorted_features[i]: sorted_importance_pct[i] 
            for i in range(top_5_count)
        }
        
        return {
            "features": sorted_features,
            "importance": sorted_importance,
            "importance_percentage": sorted_importance_pct,
            "top_features": top_features
        }
        
    except Exception as e:
        logger.error(f"Error retrieving feature importance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to retrieve feature importance", "message": str(e)}
        )


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check if the model service is healthy and ready to serve predictions",
    responses={
        200: {"description": "Service is healthy"},
        503: {"description": "Service is unhealthy"}
    }
)
async def health_check() -> Dict[str, Any]:
    """
    Check the health status of the model service.
    
    Returns:
        Health status including model load state and readiness
        
    Raises:
        HTTPException: If service is unhealthy
    """
    try:
        # Check if all required components are loaded
        model_loaded = model_loader.model is not None
        encoder_loaded = model_loader.encoder is not None
        metadata_loaded = model_loader.metadata is not None
        
        is_healthy = all([model_loaded, encoder_loaded, metadata_loaded])
        
        if not is_healthy:
            logger.warning("Health check failed: some components not loaded")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={
                    "status": "unhealthy",
                    "model_loaded": model_loaded,
                    "encoder_loaded": encoder_loaded,
                    "metadata_loaded": metadata_loaded,
                    "message": "Model service is not ready"
                }
            )
        
        logger.info("Health check passed")
        settings = get_settings()
        return {
            "status": "healthy",
            "model_loaded": model_loaded,
            "version": settings.api_version
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during health check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "message": str(e)}
        )
