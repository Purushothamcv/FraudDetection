# Render Deployment Guide - Fraud Detection API

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account with your code pushed
- Render account (free tier works)
- Model files (.pkl) uploaded to your repo or external storage

---

## 📋 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Ensure these files are in your backend folder:
- ✅ `requirements.txt`
- ✅ `build.sh` (build script)
- ✅ `start.sh` (start script)
- ✅ `app/` directory with all Python code
- ✅ `models/` directory (with model files or will be uploaded)

### 2. **Create New Web Service on Render**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/Purushothamcv/FraudDetection`

### 3. **Configure Service Settings**

```
Name: fraud-detection-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
```

### 4. **Build & Start Commands**

```bash
# Build Command:
pip install --upgrade pip && pip install -r requirements.txt

# Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 5. **Environment Variables**

Add these in Render dashboard under "Environment":

```
ENVIRONMENT=production
API_PREFIX=/api/v1
PYTHON_VERSION=3.10.0
```

### 6. **Upload Model Files** (Important!)

Since .pkl files are excluded from git, you need to:

**Option A: Add to Repository** (if small enough)
```bash
# Remove .pkl from .gitignore temporarily
git add backend/models/*.pkl
git commit -m "Add model files for deployment"
git push
```

**Option B: Use Render Disk** (recommended for large files)
1. In Render dashboard, add a **Disk** to your service
2. Mount path: `/opt/render/project/src/backend/models`
3. Upload model files via SSH or API

**Option C: Use Cloud Storage** (AWS S3, Google Cloud Storage)
- Upload models to cloud storage
- Modify `model_loader.py` to download from cloud on startup

---

## 🔧 Configuration Details

### Port Configuration
Render automatically sets `$PORT` environment variable. The app reads it:
```python
port: int = int(os.getenv("PORT", 8000))
```

### CORS Settings
Already configured to allow Render domains:
```python
cors_origins = ["*"]  # Allows all origins for production
```

### Health Check
Render will check: `https://your-app.onrender.com/health`

---

## 📦 File Structure for Render

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   ├── core/
│   ├── schemas/
│   └── services/
├── models/
│   ├── fraud_detection_xgboost_v1.pkl
│   ├── label_encoder.pkl
│   ├── model_metadata.json
│   └── feature_importance.json
├── requirements.txt
├── build.sh
└── start.sh
```

---

## 🌐 After Deployment

Your API will be available at:
```
https://fraud-detection-api.onrender.com
```

### Test Endpoints:

**Health Check:**
```bash
curl https://fraud-detection-api.onrender.com/health
```

**API Documentation:**
```
https://fraud-detection-api.onrender.com/docs
```

**Predict Transaction:**
```bash
curl -X POST https://fraud-detection-api.onrender.com/api/v1/predictions/single \
  -H "Content-Type: application/json" \
  -d '{
    "step": 1,
    "type": "PAYMENT",
    "amount": 9000.60,
    "nameOrig": "C1231006815",
    "oldbalanceOrg": 170136.00,
    "newbalanceOrig": 161136.00,
    "nameDest": "M1979787155",
    "oldbalanceDest": 0,
    "newbalanceDest": 0
  }'
```

---

## 🔍 Troubleshooting

### Issue: Build Fails
**Solution:** Check Render logs for missing dependencies
```bash
# Add missing packages to requirements.txt
```

### Issue: Models Not Found
**Solution:** Ensure model files are uploaded to Render
```bash
# Check Render disk or upload via dashboard
```

### Issue: App Crashes on Startup
**Solution:** Check logs for errors
```bash
# Common issues:
# - Missing environment variables
# - Model files not accessible
# - Import errors
```

### Issue: CORS Errors
**Solution:** Already configured for wildcard. If specific domain needed:
```python
cors_origins = ["https://your-frontend.onrender.com"]
```

---

## 💰 Render Free Tier Limits

- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic sleep after 15 min inactivity
- ✅ 512 MB RAM
- ⚠️ Slow cold starts (30-60 seconds)

---

## 📊 Monitoring

Render provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Request counts
- **Events**: Deploy history and status

---

## 🔐 Security Recommendations

1. **Add Authentication**: Implement API keys or JWT
2. **Rate Limiting**: Already configured (100 req/min)
3. **HTTPS**: Automatic with Render
4. **Restrict CORS**: Update cors_origins to specific domains

---

## 📝 Notes

- Free tier sleeps after inactivity (first request takes 30-60s)
- Upgrade to paid tier ($7/month) for always-on service
- Model files need to be uploaded separately if not in git
- Logs persist for 7 days on free tier

---

## 🆘 Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: https://github.com/Purushothamcv/FraudDetection/issues

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created and connected to repo
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables set
- [ ] Model files uploaded
- [ ] Health check passing
- [ ] API docs accessible
- [ ] Test prediction endpoint
- [ ] Update frontend with production API URL

---

**Your API URL:** `https://fraud-detection-api.onrender.com`

Replace in frontend `api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fraud-detection-api.onrender.com';
```
