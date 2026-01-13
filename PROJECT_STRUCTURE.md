# Fraud Detection System - Project Structure

## 📁 Complete Directory Tree

```
fraud-detection-system/
│
├── README.md                          # Main project documentation
├── SETUP.md                           # Quick start and deployment guide
├── docker-compose.yml                 # Docker orchestration configuration
├── .gitignore                         # Git ignore rules
│
├── backend/                           # FastAPI backend application
│   ├── Dockerfile                     # Backend container configuration
│   ├── .dockerignore                  # Docker ignore rules
│   ├── requirements.txt               # Python dependencies
│   ├── .env                          # Environment variables (not committed)
│   │
│   ├── app/                          # Main application package
│   │   ├── __init__.py               # Package initialization
│   │   ├── main.py                   # FastAPI application entry point
│   │   │
│   │   ├── api/                      # API layer
│   │   │   ├── __init__.py
│   │   │   └── routes/               # API route handlers
│   │   │       ├── __init__.py
│   │   │       ├── prediction.py     # Prediction endpoints
│   │   │       └── model.py          # Model info endpoints
│   │   │
│   │   ├── core/                     # Core functionality
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # Configuration management
│   │   │   └── model_loader.py       # ML model loading
│   │   │
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── transaction.py        # Request schemas
│   │   │   └── response.py           # Response schemas
│   │   │
│   │   └── services/                 # Business logic
│   │       ├── __init__.py
│   │       └── prediction_service.py # Prediction logic
│   │
│   ├── models/                       # ML model artifacts (from notebook)
│   │   ├── fraud_detection_xgboost_v1.pkl
│   │   ├── label_encoder.pkl
│   │   ├── model_metadata.json
│   │   ├── feature_importance.json
│   │   └── requirements.txt
│   │
│   └── logs/                         # Application logs (generated)
│       └── app.log
│
├── frontend/                         # React frontend application
│   ├── Dockerfile                    # Frontend container configuration
│   ├── .dockerignore                 # Docker ignore rules
│   ├── nginx.conf                    # Nginx configuration for production
│   ├── package.json                  # Node.js dependencies
│   ├── vite.config.js               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── index.html                   # HTML entry point
│   ├── .env                         # Environment variables (not committed)
│   ├── README.md                    # Frontend documentation
│   │
│   ├── src/                         # Source code
│   │   ├── main.jsx                 # Application entry point
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css                  # App-specific styles
│   │   ├── index.css                # Global styles
│   │   │
│   │   ├── components/              # React components
│   │   │   ├── TransactionForm.jsx  # Transaction input form
│   │   │   ├── PredictionResult.jsx # Prediction display
│   │   │   ├── FeatureImportance.jsx# Feature visualization
│   │   │   └── ModelInfo.jsx        # Model dashboard
│   │   │
│   │   └── services/                # API services
│   │       └── api.js               # API client
│   │
│   └── dist/                        # Production build (generated)
│
└── notebooks/                       # Jupyter notebooks (from previous work)
    └── fraud_detection_model.ipynb  # Model training notebook

```

## 🔍 File Purposes

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation with architecture, features, deployment |
| `SETUP.md` | Quick start guide, installation instructions, troubleshooting |
| `docker-compose.yml` | Container orchestration for full-stack deployment |
| `.gitignore` | Files and directories to exclude from version control |

### Backend (`backend/`)

| File/Directory | Purpose |
|----------------|---------|
| `Dockerfile` | Container build instructions for backend |
| `.dockerignore` | Files to exclude from Docker build context |
| `requirements.txt` | Python package dependencies |
| `.env` | Environment variables (API config, model paths, thresholds) |
| `app/main.py` | FastAPI application, middleware, routes, startup/shutdown |
| `app/api/routes/` | HTTP endpoint handlers (prediction, model info) |
| `app/core/config.py` | Settings management with pydantic-settings |
| `app/core/model_loader.py` | Singleton pattern for loading ML artifacts |
| `app/schemas/` | Pydantic models for request/response validation |
| `app/services/prediction_service.py` | Business logic for fraud detection |
| `models/` | Trained ML model artifacts (pickle files, metadata) |
| `logs/` | Application logs (created at runtime) |

### Frontend (`frontend/`)

| File/Directory | Purpose |
|----------------|---------|
| `Dockerfile` | Multi-stage build for optimized production image |
| `nginx.conf` | Nginx server configuration for SPA routing |
| `package.json` | Node.js dependencies and scripts |
| `vite.config.js` | Vite build tool configuration, dev server proxy |
| `tailwind.config.js` | Tailwind CSS theming and customization |
| `index.html` | HTML entry point for React application |
| `.env` | Environment variables (API URL) |
| `src/main.jsx` | React application bootstrapping |
| `src/App.jsx` | Main component with routing and state management |
| `src/components/` | Reusable UI components |
| `src/services/api.js` | Axios-based API client with interceptors |
| `dist/` | Production build output (created by `npm run build`) |

## 📊 Architecture Layers

### Backend Architecture

```
┌─────────────────────────────────────────────────┐
│                  FastAPI Main                    │
│  (CORS, Rate Limiting, Error Handlers, Logging) │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼───────┐          ┌────────▼────────┐
│  Prediction   │          │   Model Info    │
│    Router     │          │     Router      │
└───────┬───────┘          └────────┬────────┘
        │                           │
        │                  ┌────────▼────────┐
        │                  │  Model Loader   │
        │                  │   (Singleton)   │
        │                  └─────────────────┘
        │
┌───────▼────────┐
│   Prediction   │
│    Service     │
│  (Business     │
│   Logic)       │
└───────┬────────┘
        │
┌───────▼────────┐
│  Pydantic      │
│  Schemas       │
│  (Validation)  │
└────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│                    App.jsx                       │
│         (State Management, Tab Routing)          │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼────┐  ┌─────▼──────┐  ┌──▼──────┐  ┌───▼──────┐
│Transaction │  │ Prediction │  │ Feature │  │  Model   │
│   Form     │  │   Result   │  │Important│  │   Info   │
└───────┬────┘  └────────────┘  └────┬────┘  └───┬──────┘
        │                             │           │
        └─────────────┬───────────────┴───────────┘
                      │
              ┌───────▼────────┐
              │   API Service  │
              │     (Axios)    │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  Backend API   │
              └────────────────┘
```

## 🔄 Data Flow

### Prediction Flow

```
1. User Input (Frontend)
   └─> TransactionForm validates input
       └─> api.predictTransaction() sends POST request
           └─> FastAPI /predictions/single endpoint
               └─> PredictionResponse schema validates request
                   └─> prediction_service.predict_with_explanation()
                       ├─> preprocess_transaction()
                       ├─> predict() [XGBoost inference]
                       ├─> classify_risk()
                       ├─> calculate_confidence()
                       └─> generate_explanation()
                           └─> Return PredictionResponse
                               └─> Frontend displays in PredictionResult component
```

### Startup Flow

```
1. Docker Compose starts containers
   │
   ├─> Backend Container
   │   └─> FastAPI lifespan startup event
   │       └─> model_loader loads pickle files
   │           ├─> fraud_detection_xgboost_v1.pkl
   │           ├─> label_encoder.pkl
   │           ├─> model_metadata.json
   │           └─> feature_importance.json
   │
   └─> Frontend Container
       └─> Nginx serves static files
           └─> Proxies /api requests to backend
```

## 🎯 Key Design Patterns

### Backend Patterns

1. **Singleton Pattern**: `model_loader` ensures models loaded once
2. **Dependency Injection**: FastAPI router dependencies
3. **Service Layer Pattern**: Business logic separated from routes
4. **Factory Pattern**: Pydantic schema factories for responses
5. **Repository Pattern**: Model artifacts managed centrally

### Frontend Patterns

1. **Component Composition**: Reusable UI components
2. **Container/Presentational**: Smart containers, dumb components
3. **Custom Hooks**: Reusable stateful logic (potential)
4. **Service Layer**: API calls abstracted in services/
5. **State Lifting**: State managed at App level, passed down

## 🔐 Security Layers

1. **Input Validation**: Pydantic schemas with type checking
2. **CORS Configuration**: Restricted origins in production
3. **Rate Limiting**: SlowAPI middleware on backend
4. **Error Handling**: No sensitive data leaked in errors
5. **Health Checks**: Monitoring endpoints
6. **Docker Isolation**: Containers run with minimal privileges

## 📈 Scalability Considerations

1. **Horizontal Scaling**: Stateless FastAPI allows multiple instances
2. **Load Balancing**: Nginx can distribute traffic
3. **Caching**: Model loaded once, shared across requests
4. **Async Operations**: FastAPI async endpoints for I/O
5. **CDN Ready**: Static frontend can be served from CDN
6. **Database Ready**: Easy to add PostgreSQL/MongoDB for logging

## 🧪 Testing Structure (Future)

```
backend/
└── tests/
    ├── test_api/
    │   ├── test_prediction_routes.py
    │   └── test_model_routes.py
    ├── test_services/
    │   └── test_prediction_service.py
    └── test_core/
        └── test_model_loader.py

frontend/
└── src/
    └── __tests__/
        ├── components/
        │   ├── TransactionForm.test.jsx
        │   └── PredictionResult.test.jsx
        └── services/
            └── api.test.js
```

## 📦 Deployment Options

### 1. Docker Compose (Recommended)
- Single command deployment
- Container orchestration
- Easy scaling

### 2. Cloud Platforms
- **AWS**: ECS/Fargate + S3 + CloudFront
- **Azure**: App Service + Blob Storage + CDN
- **GCP**: Cloud Run + Cloud Storage + CDN

### 3. Kubernetes
- Helm charts for orchestration
- Horizontal pod autoscaling
- Service mesh integration

### 4. Traditional VPS
- Manual deployment with systemd
- Nginx reverse proxy
- PM2 for Node.js process management

## 🔄 CI/CD Pipeline (Suggestion)

```yaml
# .github/workflows/deploy.yml (example)

1. Trigger: Push to main branch
2. Test Backend: pytest, linting
3. Test Frontend: npm test, build
4. Build Docker Images
5. Push to Container Registry
6. Deploy to Production
7. Run Health Checks
```

This structure ensures:
- **Separation of Concerns**: Frontend, backend, models isolated
- **Modularity**: Easy to modify individual components
- **Scalability**: Can scale frontend/backend independently
- **Maintainability**: Clear organization and documentation
- **Production-Ready**: Docker, monitoring, logging included
