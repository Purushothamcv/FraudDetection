"""
Pydantic schemas for transaction input validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Literal


class TransactionInput(BaseModel):
    """
    Input schema for fraud prediction request.
    All fields are validated for type and business rules.
    """
    
    step: int = Field(
        ...,
        ge=1,
        description="Time step (1 unit = 1 hour). Must be positive.",
        example=350
    )
    
    type: Literal["CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"] = Field(
        ...,
        description="Transaction type",
        example="TRANSFER"
    )
    
    amount: float = Field(
        ...,
        gt=0,
        description="Transaction amount. Must be positive.",
        example=250000.0
    )
    
    oldbalanceOrg: float = Field(
        ...,
        ge=0,
        alias="oldbalanceOrg",
        description="Sender's balance before transaction",
        example=300000.0
    )
    
    newbalanceOrig: float = Field(
        ...,
        ge=0,
        alias="newbalanceOrig",
        description="Sender's balance after transaction",
        example=50000.0
    )
    
    oldbalanceDest: float = Field(
        ...,
        ge=0,
        alias="oldbalanceDest",
        description="Recipient's balance before transaction",
        example=0.0
    )
    
    newbalanceDest: float = Field(
        ...,
        ge=0,
        alias="newbalanceDest",
        description="Recipient's balance after transaction",
        example=250000.0
    )
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "step": 350,
                "type": "TRANSFER",
                "amount": 250000.0,
                "oldbalanceOrg": 300000.0,
                "newbalanceOrig": 50000.0,
                "oldbalanceDest": 0.0,
                "newbalanceDest": 250000.0
            }
        }
    
    @field_validator("amount", "oldbalanceOrg", "newbalanceOrig", "oldbalanceDest", "newbalanceDest")
    @classmethod
    def validate_positive(cls, v):
        """Ensure financial values are non-negative."""
        if v < 0:
            raise ValueError("Financial values cannot be negative")
        return v
    
    @field_validator("type")
    @classmethod
    def validate_transaction_type(cls, v):
        """Ensure transaction type is uppercase."""
        return v.upper()


class BatchTransactionInput(BaseModel):
    """Schema for batch prediction requests."""
    
    transactions: list[TransactionInput] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="List of transactions to predict (max 100 per batch)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "transactions": [
                    {
                        "step": 350,
                        "type": "TRANSFER",
                        "amount": 250000.0,
                        "oldbalanceOrg": 300000.0,
                        "newbalanceOrig": 50000.0,
                        "oldbalanceDest": 0.0,
                        "newbalanceDest": 250000.0
                    }
                ]
            }
        }
