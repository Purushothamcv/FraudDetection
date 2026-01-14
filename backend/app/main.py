"""Main FastAPI application for fraud detection system."""
import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.model_loader import model_loader
from app.api.routes import prediction_router, model_router

# Configure logger
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO"
)
logger.add(
    "logs/app.log",
    rotation="100 MB",
    retention="10 days",
    compression="zip",
    level="INFO"
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Load settings
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    
    Loads ML models on startup and cleans up resources on shutdown.
    """
    # Startup
    logger.info("Starting Fraud Detection API...")
    logger.info(f"Environment: {settings.env}")
    logger.info(f"API Prefix: {settings.api_prefix}")
    logger.info(f"Models Directory: {settings.models_dir}")
    
    try:
        # Load model and associated artifacts
        logger.info("Loading ML model and artifacts...")
        logger.info(f"  Model Path: {settings.model_path}")
        logger.info(f"  Encoder Path: {settings.encoder_path}")
        logger.info(f"  Metadata Path: {settings.metadata_path}")
        logger.info(f"  Feature Importance Path: {settings.feature_importance_path}")
        
        model_loader.load_all(
            model_path=settings.model_path,
            encoder_path=settings.encoder_path,
            metadata_path=settings.metadata_path,
            feature_importance_path=settings.feature_importance_path
        )
        logger.info("✓ Model artifacts loaded successfully")
        
    except Exception as e:
        logger.error(f"✗ Failed to load model artifacts: {str(e)}")
        logger.exception("Full error traceback:")
        raise
    
    logger.info("✓ Fraud Detection API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Fraud Detection API...")


# Initialize FastAPI application
app = FastAPI(
    title=settings.api_title,
    description="""
    Production-grade fraud detection API for financial transactions.
    
    ## Features
    
    * **Real-time Fraud Detection**: Analyze transactions instantly
    * **Risk Classification**: Three-tier risk assessment (LOW, MEDIUM, HIGH)
    * **Batch Processing**: Analyze multiple transactions efficiently
    * **Model Insights**: Access feature importance and model metadata
    * **Health Monitoring**: Built-in health checks and monitoring
    
    ## Risk Levels
    
    * **HIGH**: Fraud probability > 0.8 - Immediate blocking recommended
    * **MEDIUM**: Fraud probability 0.4-0.8 - Enhanced verification required
    * **LOW**: Fraud probability < 0.4 - Normal processing with monitoring
    """,
    version=settings.api_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed error messages."""
    logger.warning(f"Validation error for {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Invalid request data",
            "details": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors gracefully."""
    logger.error(f"Unexpected error for {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "path": str(request.url)
        }
    )


# Include routers
app.include_router(prediction_router, prefix=settings.api_prefix)
app.include_router(model_router, prefix=settings.api_prefix)


# Root endpoints
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "service": settings.api_title,
        "version": settings.api_version,
        "status": "operational",
        "docs": "/docs",
        "health": f"{settings.api_prefix}/model/health"
    }


@app.get("/health", tags=["root"])
async def health():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "fraud-detection-api"}


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.env == "development",
        log_level="info"
    )
