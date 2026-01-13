# 🛡️ Financial Fraud Detection System

A production-grade, full-stack fraud detection system built with FastAPI (backend) and React (frontend).

## 📋 System Overview

This system uses a trained XGBoost model to detect fraudulent financial transactions in real-time with:
- **99.97% ROC-AUC** performance
- **98.97% recall** (fraud detection rate)
- **<100ms** inference latency
- Risk-based decision engine

---

## 🏗️ Architecture

```
fraud-detection-system/
├── backend/              # FastAPI REST API
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration & model loading
│   │   ├── schemas/     # Pydantic models
│   │   └── services/    # Business logic
│   └── models/          # Trained ML models
├── frontend/            # React web application
│   └── src/
│       ├── components/  # React components
│       ├── services/    # API client
│       └── utils/       # Helper functions
└── docs/               # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will be available at: **http://localhost:3000**

---

## 📡 API Endpoints

### 1. Predict Fraud
**POST** `/api/v1/predict`

```json
{
  "step": 350,
  "type": "TRANSFER",
  "amount": 250000.0,
  "oldbalanceOrg": 300000.0,
  "newbalanceOrig": 50000.0,
  "oldbalanceDest": 0.0,
  "newbalanceDest": 250000.0
}
```

**Response:**
```json
{
  "is_fraud": true,
  "fraud_probability": 0.9342,
  "risk_level": "HIGH",
  "recommended_action": "BLOCK",
  "confidence": 0.8684,
  "explanation": "High-risk TRANSFER transaction detected"
}
```

### 2. Model Information
**GET** `/api/v1/model-info`

Returns model version, metrics, features, and training details.

### 3. Feature Importance
**GET** `/api/v1/feature-importance`

Returns top fraud indicators for explainability.

### 4. Health Check
**GET** `/health`

Returns system health status.

---

## 🎯 Risk Classification

| Probability | Risk Level | Action | Description |
|------------|-----------|--------|-------------|
| > 0.8 | **HIGH** | BLOCK | Immediately block transaction |
| 0.4 - 0.8 | **MEDIUM** | REVIEW | Require manual review + OTP |
| < 0.4 | **LOW** | ALLOW | Allow transaction to proceed |

---

## 🔒 Security Features

- Input validation with Pydantic
- Rate limiting (100 requests/minute)
- CORS configuration
- Request logging
- Error handling with meaningful messages
- Environment-based configuration

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| ROC-AUC | 99.97% |
| Recall | 98.97% |
| Precision | 42.67% |
| F1-Score | 59.63% |
| Accuracy | 99.83% |

---

## 🛠️ Technology Stack

**Backend:**
- FastAPI 0.104.0
- XGBoost 2.0.0
- Pydantic 2.0+
- Python 3.9+

**Frontend:**
- React 18
- Tailwind CSS
- Recharts (visualization)
- Axios (HTTP client)

---

## 📦 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── api/
│   │   └── routes/
│   │       ├── prediction.py   # Prediction endpoints
│   │       └── model.py        # Model info endpoints
│   ├── core/
│   │   ├── config.py           # Configuration
│   │   └── model_loader.py     # Model loading
│   ├── schemas/
│   │   ├── transaction.py      # Request schemas
│   │   └── response.py         # Response schemas
│   └── services/
│       └── prediction_service.py  # Business logic
├── models/                     # Trained models
└── requirements.txt

frontend/
├── src/
│   ├── components/
│   │   ├── TransactionForm.jsx
│   │   ├── PredictionResult.jsx
│   │   └── FeatureImportance.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Cloud Deployment Options

- **AWS:** ECS + RDS + CloudFront
- **Azure:** App Service + Container Registry
- **GCP:** Cloud Run + Cloud SQL

See `docs/deployment.md` for detailed instructions.

---

## 📈 Monitoring & Logging

- Request/response logging
- Performance metrics tracking
- Error rate monitoring
- Model drift detection (recommended: add MLflow)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Data Science Team**  
Contact: fraud-detection@company.com

---

## 🙏 Acknowledgments

- XGBoost for the powerful gradient boosting framework
- FastAPI for the high-performance web framework
- React for the modern frontend framework

---

**Status:** ✅ Production-Ready  
**Version:** 1.0.0  
**Last Updated:** January 13, 2026
