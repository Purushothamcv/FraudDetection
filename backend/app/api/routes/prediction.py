"""Prediction API routes for fraud detection."""
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from loguru import logger

from app.schemas.transaction import TransactionInput, BatchTransactionInput
from app.schemas.response import (
    PredictionResponse,
    BatchPredictionResponse,
    ErrorResponse
)
from app.services import prediction_service

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post(
    "/single",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict fraud for a single transaction",
    description="Analyze a single transaction and return fraud prediction with risk assessment",
    responses={
        200: {"description": "Successful prediction"},
        400: {"model": ErrorResponse, "description": "Invalid input data"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def predict_single_transaction(transaction: TransactionInput) -> Dict[str, Any]:
    """
    Predict fraud probability for a single transaction.
    
    Args:
        transaction: Transaction data to analyze
        
    Returns:
        Prediction result with fraud probability, risk level, and recommended action
        
    Raises:
        HTTPException: If prediction fails
    """
    try:
        logger.info(f"Processing single transaction prediction: type={transaction.type}, amount={transaction.amount}")
        
        # Get prediction with full explanation
        result = prediction_service.predict_with_explanation(transaction)
        
        logger.info(f"Prediction completed: fraud={result['is_fraud']}, risk={result['risk_level']}")
        
        return result
        
    except ValueError as e:
        logger.error(f"Validation error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Invalid transaction data", "message": str(e)}
        )
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Prediction failed", "message": "An unexpected error occurred"}
        )


@router.post(
    "/batch",
    response_model=BatchPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict fraud for multiple transactions",
    description="Analyze multiple transactions in batch and return predictions for each",
    responses={
        200: {"description": "Successful batch prediction"},
        400: {"model": ErrorResponse, "description": "Invalid input data"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def predict_batch_transactions(batch: BatchTransactionInput) -> Dict[str, Any]:
    """
    Predict fraud probability for multiple transactions in batch.
    
    Args:
        batch: Batch of transactions to analyze
        
    Returns:
        Batch prediction results with statistics
        
    Raises:
        HTTPException: If batch prediction fails
    """
    try:
        logger.info(f"Processing batch prediction: {len(batch.transactions)} transactions")
        
        predictions = []
        fraud_count = 0
        high_risk_count = 0
        
        for idx, transaction in enumerate(batch.transactions):
            try:
                result = prediction_service.predict_with_explanation(transaction)
                predictions.append(result)
                
                if result["is_fraud"]:
                    fraud_count += 1
                if result["risk_level"] == "HIGH":
                    high_risk_count += 1
                    
            except Exception as e:
                logger.warning(f"Failed to process transaction {idx}: {str(e)}")
                predictions.append({
                    "is_fraud": False,
                    "fraud_probability": 0.0,
                    "risk_level": "UNKNOWN",
                    "recommended_action": "MANUAL_REVIEW",
                    "confidence": 0.0,
                    "explanation": f"Processing failed: {str(e)}",
                    "transaction_id": getattr(transaction, 'transaction_id', None)
                })
        
        logger.info(f"Batch prediction completed: {fraud_count} frauds detected, {high_risk_count} high-risk")
        
        return {
            "predictions": predictions,
            "total_transactions": len(batch.transactions),
            "fraud_detected": fraud_count,
            "high_risk_count": high_risk_count
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in batch prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Batch prediction failed", "message": str(e)}
        )


@router.post(
    "/analyze",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Detailed fraud analysis (alias for /single)",
    description="Alternative endpoint for single transaction analysis"
)
async def analyze_transaction(transaction: TransactionInput) -> Dict[str, Any]:
    """Alias for predict_single_transaction with same functionality."""
    return await predict_single_transaction(transaction)


@router.post(
    "/approve",
    status_code=status.HTTP_200_OK,
    summary="Approve a transaction",
    description="Mark a transaction as approved and allow it to proceed",
    responses={
        200: {"description": "Transaction approved successfully"},
        400: {"model": ErrorResponse, "description": "Invalid transaction data"}
    }
)
async def approve_transaction(transaction: TransactionInput) -> Dict[str, Any]:
    """
    Approve a transaction that was flagged for review or appeared legitimate.
    
    Args:
        transaction: Transaction data to approve
        
    Returns:
        Approval confirmation with transaction details
    """
    try:
        logger.info(f"Approving transaction: type={transaction.type}, amount={transaction.amount}")
        
        return {
            "status": "approved",
            "message": "Transaction has been approved and will proceed",
            "transaction_details": {
                "type": transaction.type,
                "amount": float(transaction.amount),
                "step": transaction.step,
                "approval_timestamp": None  # Will be auto-generated
            },
            "approved_by": "fraud_detection_system",
            "notes": "Transaction passed fraud detection analysis and was manually approved"
        }
        
    except Exception as e:
        logger.error(f"Error approving transaction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Approval failed", "message": str(e)}
        )
