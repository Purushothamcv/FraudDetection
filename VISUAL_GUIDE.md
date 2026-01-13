# 📊 System Overview - Visual Guide

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    (http://localhost:3000)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Port 3000)                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Transaction │  │  Prediction  │  │     Feature      │   │
│  │    Form     │  │    Result    │  │   Importance     │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Model Info │  │  API Service │  │   Tailwind CSS   │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND (Port 8000)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              API Routes Layer                        │   │
│  │  • POST /predictions/single                          │   │
│  │  • POST /predictions/batch                           │   │
│  │  • GET  /model/info                                  │   │
│  │  • GET  /model/feature-importance                    │   │
│  │  • GET  /model/health                                │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │           Prediction Service (Business Logic)        │   │
│  │  • preprocess_transaction()                          │   │
│  │  • predict()                                         │   │
│  │  • classify_risk()                                   │   │
│  │  • calculate_confidence()                            │   │
│  │  • generate_explanation()                            │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │           Model Loader (Singleton Pattern)           │   │
│  │  • fraud_detection_xgboost_v1.pkl                    │   │
│  │  • label_encoder.pkl                                 │   │
│  │  • model_metadata.json                               │   │
│  │  • feature_importance.json                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

### Transaction Prediction Flow

```
1. User enters transaction data
   │
   ├─► step: 1
   ├─► type: "TRANSFER"
   ├─► amount: 500000.00
   ├─► oldbalanceOrg: 500000.00
   ├─► newbalanceOrig: 0.00
   ├─► oldbalanceDest: 0.00
   └─► newbalanceDest: 500000.00
   │
   ▼
2. Frontend validates input (Pydantic-style validation)
   │
   ├─► ✓ All numeric values present
   ├─► ✓ Amount > 0
   ├─► ✓ Balances >= 0
   └─► ✓ Valid transaction type
   │
   ▼
3. API call: POST /api/v1/predictions/single
   │
   ▼
4. Backend Pydantic schema validates request
   │
   ▼
5. PredictionService processes transaction
   │
   ├─► Encode transaction type (TRANSFER → 4)
   │
   ├─► Create feature vector:
   │   [1, 500000.0, 500000.0, 0.0, 0.0, 500000.0, 4]
   │
   ├─► XGBoost model prediction
   │   fraud_probability = 0.9456
   │
   ├─► Risk classification
   │   HIGH (> 0.8)
   │
   ├─► Confidence calculation
   │   confidence = 0.8912
   │
   └─► Generate explanation
       "High-risk TRANSFER transaction detected with 
        account draining pattern"
   │
   ▼
6. Return PredictionResponse
   │
   ├─► is_fraud: true
   ├─► fraud_probability: 0.9456
   ├─► risk_level: "HIGH"
   ├─► recommended_action: "BLOCK"
   ├─► confidence: 0.8912
   └─► explanation: "..."
   │
   ▼
7. Frontend displays result with color-coded UI
   │
   ├─► Red background for HIGH risk
   ├─► Progress bar showing 94.56%
   ├─► "BLOCK" action button
   └─► Detailed explanation text
```

## 📦 Technology Stack Visualization

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND STACK                       │
├─────────────────────────────────────────────────────────┤
│  React 18.2         │  Modern UI library                │
│  Vite 5.0           │  Fast build tool                  │
│  Tailwind CSS 3.3   │  Utility-first styling            │
│  Recharts 2.10      │  Data visualization               │
│  Axios 1.6          │  HTTP client                      │
│  Lucide React       │  Icon library                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     BACKEND STACK                        │
├─────────────────────────────────────────────────────────┤
│  FastAPI 0.104      │  Modern Python web framework      │
│  Pydantic 2.5       │  Data validation                  │
│  XGBoost 2.0        │  ML model (99.97% ROC-AUC)        │
│  Scikit-learn 1.3   │  ML utilities                     │
│  Uvicorn 0.24       │  ASGI server                      │
│  Loguru 0.7         │  Logging                          │
│  SlowAPI 0.1        │  Rate limiting                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      DEVOPS STACK                        │
├─────────────────────────────────────────────────────────┤
│  Docker             │  Containerization                 │
│  Docker Compose     │  Multi-container orchestration    │
│  Nginx              │  Reverse proxy & static serving   │
└─────────────────────────────────────────────────────────┘
```

## 🎨 UI Component Hierarchy

```
App.jsx
│
├─► Header
│   ├─► Logo (Shield icon)
│   ├─► Title: "Fraud Detection System"
│   └─► Status indicator: "System Online"
│
├─► Navigation Tabs
│   ├─► Predict Tab (Shield icon)
│   ├─► Feature Importance Tab (BarChart icon)
│   └─► Model Info Tab (Info icon)
│
├─► Content Area
│   │
│   ├─► [Predict Tab]
│   │   ├─► TransactionForm
│   │   │   ├─► Sample Data Buttons
│   │   │   │   ├─► Legitimate
│   │   │   │   ├─► Suspicious
│   │   │   │   └─► High Risk
│   │   │   ├─► Input Fields
│   │   │   │   ├─► Step (number)
│   │   │   │   ├─► Type (dropdown)
│   │   │   │   ├─► Amount (number)
│   │   │   │   ├─► Origin Old Balance (number)
│   │   │   │   ├─► Origin New Balance (number)
│   │   │   │   ├─► Dest Old Balance (number)
│   │   │   │   └─► Dest New Balance (number)
│   │   │   └─► Submit Button
│   │   │
│   │   └─► PredictionResult
│   │       ├─► Status Card (color-coded)
│   │       │   ├─► Risk Icon
│   │       │   ├─► Title
│   │       │   ├─► Explanation
│   │       │   └─► Risk/Action Badges
│   │       ├─► Metrics Grid
│   │       │   ├─► Fraud Probability (with bar)
│   │       │   ├─► Confidence (with bar)
│   │       │   └─► Risk Level
│   │       └─► Recommended Action Panel
│   │
│   ├─► [Feature Importance Tab]
│   │   └─► FeatureImportance
│   │       ├─► Info Banner
│   │       ├─► Bar Chart (Recharts)
│   │       └─► Feature Descriptions
│   │
│   └─► [Model Info Tab]
│       └─► ModelInfo
│           ├─► Health Status Card
│           ├─► Model Information Grid
│           ├─► Performance Metrics
│           ├─► Risk Thresholds
│           └─► Input Features List
│
└─► Footer
    ├─► Copyright
    └─► Model Stats
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Frontend Validation                            │
│  • Client-side form validation                           │
│  • Type checking in React                                │
│  • Required field enforcement                            │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Network Security                               │
│  • HTTPS in production                                   │
│  • CORS configuration                                    │
│  • API key authentication (future)                       │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Backend Validation                             │
│  • Pydantic schema validation                            │
│  • Type coercion and checking                            │
│  • Business rule enforcement                             │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Rate Limiting                                  │
│  • SlowAPI middleware                                    │
│  • IP-based throttling                                   │
│  • Request quota enforcement                             │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Error Handling                                 │
│  • Generic error messages                                │
│  • No sensitive data in responses                        │
│  • Structured error logging                              │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 6: Container Isolation                            │
│  • Docker containerization                               │
│  • Minimal base images                                   │
│  • Read-only model files                                 │
└─────────────────────────────────────────────────────────┘
```

## 📊 Model Performance Metrics

```
╔═══════════════════════════════════════════════════════════╗
║              FRAUD DETECTION MODEL METRICS                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  ROC-AUC Score:     99.97%  ████████████████████▓         ║
║                                                            ║
║  Recall:            98.97%  ███████████████████▓          ║
║                                                            ║
║  Precision:         42.67%  ████████▓                     ║
║                                                            ║
║  F1 Score:          59.63%  ███████████▓                  ║
║                                                            ║
║  Training Samples:  5,090,096                             ║
║  Features:          7                                      ║
║  Model Type:        XGBoost Classifier                     ║
║  Framework:         XGBoost 2.0.0                          ║
║                                                            ║
╠═══════════════════════════════════════════════════════════╣
║                   RISK CLASSIFICATION                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  HIGH RISK    (>80%):  Block immediately     🔴           ║
║  MEDIUM RISK  (40-80%): Manual review       🟡            ║
║  LOW RISK     (<40%):  Allow transaction    🟢            ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

## 🎯 Feature Importance Ranking

```
1. oldbalanceOrg      ████████████████████████  (45%)
   → Most important: Origin account balance before transaction

2. amount             █████████████             (23%)
   → Second: Transaction amount

3. newbalanceOrig     █████████                 (18%)
   → Third: Origin account balance after transaction

4. type_encoded       ███████                   (14%)
   → Fourth: Type of transaction (TRANSFER, CASH_OUT, etc.)

5. oldbalanceDest     ████                      (8%)
   → Fifth: Destination account balance before

6. newbalanceDest     ███                       (6%)
   → Sixth: Destination account balance after

7. step               ██                        (4%)
   → Least: Time step of transaction
```

## 🚀 Deployment Scenarios

### Scenario 1: Local Development
```
Developer Machine
├─► Terminal 1: Python backend (port 8000)
└─► Terminal 2: React dev server (port 3000)
```

### Scenario 2: Docker Compose
```
Docker Engine
├─► Container 1: FastAPI backend (port 8000)
├─► Container 2: React + Nginx (port 80)
└─► Network: fraud-detection-network
```

### Scenario 3: Cloud Deployment (AWS Example)
```
AWS Cloud
├─► ECS Fargate
│   ├─► Backend Task (with model files from S3)
│   └─► Auto-scaling 2-10 instances
│
├─► S3 + CloudFront
│   └─► Frontend static files
│
├─► Application Load Balancer
│   └─► Routes /api to backend
│
└─► CloudWatch
    └─► Logs & Monitoring
```

## 📈 Scalability Options

```
Small Scale (< 100 req/min)
└─► Single Docker Compose deployment
    ├─► 1 backend container
    └─► 1 frontend container

Medium Scale (100-1000 req/min)
└─► Docker Swarm or Kubernetes
    ├─► 3-5 backend replicas
    ├─► Load balancer
    └─► Shared model storage (NFS/S3)

Large Scale (> 1000 req/min)
└─► Kubernetes with auto-scaling
    ├─► 10+ backend pods (horizontal scaling)
    ├─► Redis cache for predictions
    ├─► Model versioning with MLflow
    └─► Distributed tracing (Jaeger)
```

## 🎨 Color Scheme Reference

```css
/* Risk Levels */
HIGH    = #ef4444  /* Red-500 */    🔴
MEDIUM  = #f59e0b  /* Amber-500 */  🟡
LOW     = #22c55e  /* Green-500 */  🟢

/* UI Colors */
Primary   = #3b82f6  /* Blue-600 */
Secondary = #6b7280  /* Gray-500 */
Success   = #10b981  /* Emerald-500 */
Warning   = #f59e0b  /* Amber-500 */
Danger    = #ef4444  /* Red-500 */

/* Background */
Page BG   = #f9fafb  /* Gray-50 */
Card BG   = #ffffff  /* White */
Hover BG  = #f3f4f6  /* Gray-100 */
```

## 🔧 Configuration Matrix

| Environment | Backend Port | Frontend Port | CORS Origins | Log Level |
|------------|--------------|---------------|--------------|-----------|
| Development | 8000 | 3000 | localhost:3000 | DEBUG |
| Testing | 8000 | 3000 | test.local | INFO |
| Staging | 8000 | 80 | staging.example.com | INFO |
| Production | 8000 | 80 | example.com | WARNING |

## 🎯 API Response Examples

### Legitimate Transaction
```json
{
  "is_fraud": false,
  "fraud_probability": 0.0234,
  "risk_level": "LOW",
  "recommended_action": "ALLOW",
  "confidence": 0.9532,
  "explanation": "Low-risk PAYMENT transaction with normal patterns"
}
```

### Suspicious Transaction
```json
{
  "is_fraud": true,
  "fraud_probability": 0.6543,
  "risk_level": "MEDIUM",
  "recommended_action": "REVIEW",
  "confidence": 0.3086,
  "explanation": "Medium-risk TRANSFER transaction requiring verification"
}
```

### Fraudulent Transaction
```json
{
  "is_fraud": true,
  "fraud_probability": 0.9456,
  "risk_level": "HIGH",
  "recommended_action": "BLOCK",
  "confidence": 0.8912,
  "explanation": "High-risk TRANSFER with account draining pattern"
}
```

This visual guide provides a comprehensive overview of how all components work together!
