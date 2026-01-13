"""
Prediction service module.
Contains business logic for fraud detection predictions.
"""

import numpy as np
from typing import Tuple, Literal
from loguru import logger

from ..core.model_loader import model_loader
from ..core.config import get_settings
from ..schemas.transaction import TransactionInput


class PredictionService:
    """
    Service class for fraud detection predictions.
    Handles preprocessing, prediction, and risk classification.
    """
    
    def __init__(self):
        """Initialize prediction service with settings."""
        self.settings = get_settings()
        self._model = None
        self._encoder = None
    
    @property
    def model(self):
        """Lazy load model."""
        if self._model is None:
            self._model = model_loader.model
        return self._model
    
    @property
    def encoder(self):
        """Lazy load encoder."""
        if self._encoder is None:
            self._encoder = model_loader.encoder
        return self._encoder
        
    def preprocess_transaction(self, transaction: TransactionInput) -> np.ndarray:
        """
        Preprocess transaction data for model prediction.
        
        Args:
            transaction: TransactionInput object with transaction details
            
        Returns:
            numpy array with preprocessed features in correct order
        """
        # Encode transaction type
        try:
            type_encoded = self.encoder.transform([transaction.type])[0]
        except Exception as e:
            logger.error(f"Encoding error for type '{transaction.type}': {e}")
            raise ValueError(f"Invalid transaction type: {transaction.type}")
        
        # Create feature vector in exact order expected by model
        # Order: step, amount, oldbalanceOrg, newbalanceOrig, oldbalanceDest, newbalanceDest, type_encoded
        features = np.array([[
            transaction.step,
            transaction.amount,
            transaction.oldbalanceOrg,
            transaction.newbalanceOrig,
            transaction.oldbalanceDest,
            transaction.newbalanceDest,
            type_encoded
        ]], dtype=np.float32)
        
        return features
    
    def predict(self, transaction: TransactionInput) -> Tuple[bool, float]:
        """
        Predict if transaction is fraudulent.
        
        Args:
            transaction: TransactionInput object
            
        Returns:
            Tuple of (is_fraud: bool, fraud_probability: float)
        """
        try:
            # Preprocess
            features = self.preprocess_transaction(transaction)
            
            # Predict probability
            fraud_probability = float(self.model.predict_proba(features)[0, 1])
            
            # Classification (using default threshold of 0.5)
            is_fraud = fraud_probability >= 0.5
            
            logger.info(
                f"Prediction: type={transaction.type}, amount=${transaction.amount:,.2f}, "
                f"prob={fraud_probability:.4f}, fraud={is_fraud}"
            )
            
            return is_fraud, fraud_probability
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise RuntimeError(f"Prediction failed: {e}")
    
    def classify_risk(
        self,
        fraud_probability: float
    ) -> Tuple[Literal["LOW", "MEDIUM", "HIGH"], Literal["ALLOW", "REVIEW", "BLOCK"]]:
        """
        Classify risk level and recommend action based on probability.
        
        Risk Levels:
        - HIGH (>= 0.8): Block transaction immediately
        - MEDIUM (0.4 - 0.8): Require manual review + OTP
        - LOW (< 0.4): Allow transaction
        
        Args:
            fraud_probability: Probability of fraud (0.0 to 1.0)
            
        Returns:
            Tuple of (risk_level, recommended_action)
        """
        high_threshold = self.settings.high_risk_threshold
        medium_threshold = self.settings.medium_risk_threshold
        
        if fraud_probability >= high_threshold:
            return "HIGH", "BLOCK"
        elif fraud_probability >= medium_threshold:
            return "MEDIUM", "REVIEW"
        else:
            return "LOW", "ALLOW"
    
    def calculate_confidence(self, fraud_probability: float) -> float:
        """
        Calculate model confidence based on distance from decision boundary.
        
        Confidence is high when probability is close to 0 or 1,
        low when it's close to 0.5 (decision boundary).
        
        Args:
            fraud_probability: Probability of fraud
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        # Distance from 0.5 decision boundary, normalized to 0-1
        confidence = abs(fraud_probability - 0.5) * 2
        return round(confidence, 4)
    
    def generate_explanation(
        self,
        transaction: TransactionInput,
        is_fraud: bool,
        risk_level: str
    ) -> str:
        """
        Generate human-readable explanation for the prediction.
        
        Args:
            transaction: Input transaction
            is_fraud: Fraud prediction
            risk_level: Risk classification
            
        Returns:
            Explanation string
        """
        if risk_level == "HIGH":
            # Check for specific patterns
            balance_change_ratio = abs(
                transaction.oldbalanceOrg - transaction.newbalanceOrig
            ) / max(transaction.oldbalanceOrg, 1)
            
            if balance_change_ratio > 0.8:
                pattern = "with account draining pattern"
            elif transaction.amount > 100000:
                pattern = "with high transaction amount"
            else:
                pattern = "with suspicious characteristics"
            
            return f"High-risk {transaction.type} transaction detected {pattern}"
        
        elif risk_level == "MEDIUM":
            return f"Medium-risk {transaction.type} transaction requires manual review"
        
        else:
            return f"Low-risk {transaction.type} transaction appears legitimate"
    
    def predict_with_explanation(self, transaction: TransactionInput) -> dict:
        """
        Complete prediction with risk classification and explanation.
        
        Args:
            transaction: TransactionInput object
            
        Returns:
            Dictionary with prediction results
        """
        # Get prediction
        is_fraud, fraud_probability = self.predict(transaction)
        
        # Classify risk
        risk_level, recommended_action = self.classify_risk(fraud_probability)
        
        # Calculate confidence
        confidence = self.calculate_confidence(fraud_probability)
        
        # Generate explanation
        explanation = self.generate_explanation(transaction, is_fraud, risk_level)
        
        return {
            "is_fraud": is_fraud,
            "fraud_probability": round(fraud_probability, 4),
            "risk_level": risk_level,
            "recommended_action": recommended_action,
            "confidence": confidence,
            "explanation": explanation
        }


# Global service instance
prediction_service = PredictionService()
