"""
Pydantic schemas for API responses.
"""

from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any
from datetime import datetime


class PredictionResponse(BaseModel):
    """Response schema for fraud prediction."""
    
    is_fraud: bool = Field(
        ...,
        description="Whether the transaction is classified as fraud"
    )
    
    fraud_probability: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Probability of fraud (0.0 to 1.0)"
    )
    
    risk_level: Literal["LOW", "MEDIUM", "HIGH"] = Field(
        ...,
        description="Risk classification based on probability"
    )
    
    recommended_action: Literal["ALLOW", "REVIEW", "BLOCK"] = Field(
        ...,
        description="Recommended action based on risk level"
    )
    
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Model confidence score"
    )
    
    explanation: str = Field(
        ...,
        description="Human-readable explanation of the prediction"
    )
    
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Prediction timestamp (UTC)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_fraud": True,
                "fraud_probability": 0.9342,
                "risk_level": "HIGH",
                "recommended_action": "BLOCK",
                "confidence": 0.8684,
                "explanation": "High-risk TRANSFER transaction detected with account draining pattern",
                "timestamp": "2026-01-13T10:30:00Z"
            }
        }


class BatchPredictionResponse(BaseModel):
    """Response schema for batch predictions."""
    
    predictions: List[Dict[str, Any]] = Field(
        ...,
        description="List of prediction results"
    )
    
    total_transactions: int = Field(
        ...,
        description="Total number of transactions processed"
    )
    
    fraud_detected: int = Field(
        ...,
        description="Number of fraudulent transactions detected"
    )
    
    high_risk_count: int = Field(
        ...,
        description="Number of high-risk transactions"
    )


class ModelInfoResponse(BaseModel):
    """Response schema for model information."""
    
    model_config = {"protected_namespaces": ()}  # Allow model_ prefix
    
    model_version: str = Field(..., description="Model version")
    model_type: str = Field(..., description="Model algorithm type")
    training_date: str = Field(..., description="Training date")
    
    performance_metrics: Dict[str, float] = Field(
        ...,
        description="Model performance metrics"
    )
    
    features: List[str] = Field(
        ...,
        description="List of input features"
    )
    
    hyperparameters: Dict[str, Any] = Field(
        ...,
        description="Model hyperparameters"
    )
    
    training_data_size: int = Field(
        ...,
        description="Number of training samples"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "model_version": "1.0",
                "model_type": "XGBoost Classifier",
                "training_date": "2026-01-13",
                "performance_metrics": {
                    "roc_auc": 0.9997,
                    "recall": 0.9897,
                    "precision": 0.4267,
                    "f1_score": 0.5963
                },
                "features": [
                    "step", "amount", "oldbalanceOrg", 
                    "newbalanceOrig", "oldbalanceDest", 
                    "newbalanceDest", "type_encoded"
                ],
                "hyperparameters": {
                    "n_estimators": 100,
                    "max_depth": 10,
                    "learning_rate": 0.1
                },
                "training_data_size": 5090096
            }
        }


class FeatureImportanceResponse(BaseModel):
    """Response schema for feature importance."""
    
    features: List[str] = Field(
        ...,
        description="Feature names ordered by importance"
    )
    
    importance: List[float] = Field(
        ...,
        description="Feature importance scores"
    )
    
    importance_percentage: List[float] = Field(
        ...,
        description="Feature importance as percentages"
    )
    
    top_features: Dict[str, float] = Field(
        ...,
        description="Top 5 most important features with percentages"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "features": [
                    "oldbalanceOrg",
                    "amount",
                    "newbalanceOrig",
                    "type_encoded"
                ],
                "importance": [0.45, 0.23, 0.18, 0.14],
                "importance_percentage": [45.0, 23.0, 18.0, 14.0],
                "top_features": {
                    "oldbalanceOrg": 45.0,
                    "amount": 23.0,
                    "newbalanceOrig": 18.0,
                    "type_encoded": 14.0
                }
            }
        }


class HealthCheckResponse(BaseModel):
    """Response schema for health check."""
    
    model_config = {"protected_namespaces": ()}  # Allow model_ prefix
    
    status: str = Field(..., description="API health status")
    model_loaded: bool = Field(..., description="Whether model is loaded")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    """Response schema for errors."""
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
