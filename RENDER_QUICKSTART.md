# 🚀 RENDER DEPLOYMENT - QUICK START

## Step 1: Go to Render
👉 https://dashboard.render.com/

## Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: `Purushothamcv/FraudDetection`
3. Select repository

## Step 3: Configure Service

```yaml
Name:           fraud-detection-api
Region:         Oregon (US West)
Branch:         main
Root Directory: backend
Runtime:        Python 3
```

## Step 4: Commands

**Build Command:**
```bash
pip install --upgrade pip && pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Step 5: Environment Variables

Click "Advanced" → Add:
```
ENVIRONMENT = production
API_PREFIX = /api/v1
```

## Step 6: Deploy!
Click **"Create Web Service"** - Wait 5-10 minutes

## ⚠️ IMPORTANT: Upload Model Files

Your .pkl files are NOT in git (they're too large).

### Option A: Upload via Render Dashboard
1. After deploy, go to service → Shell
2. Upload files to `/opt/render/project/src/backend/models/`

### Option B: Add to Git (if <100MB total)
```bash
# In your local folder:
cd "c:\Users\purus\OneDrive\New folder\Desktop\jobassaignment\fraud-detection-system"

# Temporarily remove .pkl from .gitignore
# Edit .gitignore and comment out: # *.pkl

git add backend/models/*.pkl
git commit -m "Add model files"
git push

# Redeploy on Render
```

### Option C: Use Cloud Storage
Upload to AWS S3/Google Cloud and modify code to download on startup.

## 🌐 Your API URL

After deployment:
```
https://fraud-detection-api.onrender.com
```

Test it:
```bash
curl https://fraud-detection-api.onrender.com/health
```

View docs:
```
https://fraud-detection-api.onrender.com/docs
```

## 🔗 Update Frontend

In `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://fraud-detection-api.onrender.com';
```

---

## ⏱️ First Request Takes 30-60 Seconds (Free Tier)
- Service sleeps after 15 min inactivity
- Wakes up on first request
- Upgrade to $7/month for always-on

## 📊 Monitor
- View logs in Render dashboard
- Check metrics
- See deployment events

---

## ✅ Success Checklist
- [ ] Service deployed successfully
- [ ] Health check returns 200 OK
- [ ] API docs accessible at /docs
- [ ] Model files uploaded
- [ ] Test prediction endpoint works
- [ ] Update frontend with production URL

---

**Need Help?** Check RENDER_DEPLOYMENT.md for detailed troubleshooting.
