# Fraud Detection System - Quick Start Guide

## Prerequisites

- **Python 3.9+** with pip
- **Node.js 16+** with npm
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🚀 Quick Start (Development)

### Option 1: Manual Setup

#### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Verify .env file exists with correct paths
# Make sure MODEL_PATH points to your pickle files

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

#### 2. Frontend Setup

Open a **new terminal**:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Docker Compose (Recommended for Production)

```powershell
# From the project root directory
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

- Frontend: `http://localhost:80`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## 📋 System Requirements

### Backend
- Python 3.9 or higher
- 2GB RAM minimum
- Model files in `backend/models/` directory:
  - `fraud_detection_xgboost_v1.pkl`
  - `label_encoder.pkl`
  - `model_metadata.json`
  - `feature_importance.json`

### Frontend
- Node.js 16 or higher
- npm 7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🧪 Testing the System

### 1. Test Backend API

```powershell
# Health check
curl http://localhost:8000/health

# Model info
curl http://localhost:8000/api/v1/model/info

# Test prediction
curl -X POST http://localhost:8000/api/v1/predictions/single `
  -H "Content-Type: application/json" `
  -d '{
    "step": 1,
    "type": "TRANSFER",
    "amount": 500000,
    "oldbalanceOrg": 500000,
    "newbalanceOrig": 0,
    "oldbalanceDest": 0,
    "newbalanceDest": 500000
  }'
```

### 2. Test Frontend

1. Open `http://localhost:3000` in your browser
2. Click "Sample: High Risk" button
3. Click "Analyze Transaction"
4. View the prediction results

### 3. Sample Test Cases

**Legitimate Transaction:**
```json
{
  "step": 1,
  "type": "PAYMENT",
  "amount": 50.00,
  "oldbalanceOrg": 1000.00,
  "newbalanceOrig": 950.00,
  "oldbalanceDest": 2000.00,
  "newbalanceDest": 2050.00
}
```

**Suspicious Transaction:**
```json
{
  "step": 1,
  "type": "TRANSFER",
  "amount": 500000.00,
  "oldbalanceOrg": 500000.00,
  "newbalanceOrig": 0.00,
  "oldbalanceDest": 0.00,
  "newbalanceDest": 500000.00
}
```

## 🔧 Configuration

### Backend Configuration (.env)

```env
# API Settings
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api/v1

# Project
PROJECT_NAME=Fraud Detection API

# Model Paths (adjust to your setup)
MODEL_PATH=models/fraud_detection_xgboost_v1.pkl
ENCODER_PATH=models/label_encoder.pkl
METADATA_PATH=models/model_metadata.json
FEATURE_IMPORTANCE_PATH=models/feature_importance.json

# Risk Thresholds
HIGH_RISK_THRESHOLD=0.8
MEDIUM_RISK_THRESHOLD=0.4

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:80
```

### Frontend Configuration (.env)

```env
VITE_API_URL=http://localhost:8000
```

## 📦 Production Deployment

### Using Docker Compose

```powershell
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Production Deployment

#### Backend

```powershell
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn (more production-ready)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Frontend

```powershell
# Build for production
npm run build

# The dist/ folder can be served with any static file server
# Example with a simple Python server:
cd dist
python -m http.server 80
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Model files not found
```powershell
# Solution: Check MODEL_PATH in .env points to correct location
# Ensure all model files exist:
ls backend/models/
```

**Problem:** Port 8000 already in use
```powershell
# Solution: Use a different port
uvicorn app.main:app --port 8001
```

**Problem:** Import errors
```powershell
# Solution: Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Frontend Issues

**Problem:** Cannot connect to backend
```powershell
# Solution: Check VITE_API_URL in .env
# Make sure backend is running
curl http://localhost:8000/health
```

**Problem:** Node modules errors
```powershell
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Problem:** Permission denied
```powershell
# Solution: Run as administrator or check Docker permissions
docker-compose up --build
```

**Problem:** Port conflicts
```powershell
# Solution: Stop conflicting services or change ports in docker-compose.yml
netstat -ano | findstr :8000
netstat -ano | findstr :80
```

## 📊 Monitoring

### Check System Health

```powershell
# Backend health
curl http://localhost:8000/api/v1/model/health

# Frontend health (if using Docker)
curl http://localhost:80

# Docker container status
docker-compose ps
```

### View Logs

```powershell
# Backend logs (if using Docker)
docker-compose logs -f backend

# Frontend logs (if using Docker)
docker-compose logs -f frontend

# All logs
docker-compose logs -f
```

## 🔐 Security Considerations

1. **Never commit `.env` files** with sensitive credentials
2. **Change default CORS origins** in production
3. **Use HTTPS** in production environments
4. **Implement rate limiting** (already included in backend)
5. **Regular security updates** for dependencies

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/
- **XGBoost Documentation**: https://xgboost.readthedocs.io/
- **Docker Documentation**: https://docs.docker.com/

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `backend/logs/app.log`
3. Check API documentation: `http://localhost:8000/docs`
4. Review browser console for frontend errors

## 📝 License

MIT License - See LICENSE file for details
