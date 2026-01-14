# Vercel Deployment Guide for Fraud Detection Frontend

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account
- Vercel account (free tier works perfectly)
- Backend deployed on Render: https://frauddetection-9w5g.onrender.com

### Step 1: Push Frontend Code to GitHub
```bash
cd "c:\Users\purus\OneDrive\New folder\Desktop\jobassaignment\fraud-detection-system"
git add frontend/.env.production frontend/vercel.json
git commit -m "Add Vercel deployment configuration with Render backend URL"
git push
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `fraud-detection-frontend` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? `N`

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard (Easier)
1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import from GitHub:**
   - Select your repository: `Purushothamcv/FraudDetection`
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   Add this environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://frauddetection-9w5g.onrender.com`

6. **Click "Deploy"**

### Step 3: Verify Deployment
Once deployed, Vercel will provide you with a URL like:
- `https://fraud-detection-frontend.vercel.app`
- Or your custom domain

**Test the application:**
1. Open the Vercel URL
2. Check if the form loads correctly
3. Fill in transaction details
4. Submit and verify it connects to your Render backend
5. Check predictions are working

### Step 4: Update CORS (if needed)
If you encounter CORS errors:

1. **Edit backend CORS settings** (already configured for wildcard):
   ```python
   # backend/app/main.py (already set)
   allow_origins=["*"]  # Allows all origins including Vercel
   ```

2. **Redeploy backend** (if you made changes):
   - Go to Render dashboard
   - Manual Deploy → Deploy

## 📝 Configuration Files Created

### `.env.production`
Sets the backend API URL for production builds:
```env
VITE_API_URL=https://frauddetection-9w5g.onrender.com
```

### `vercel.json`
Configures Vercel deployment settings:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔍 Troubleshooting

### Issue: "Failed to fetch" errors
**Solution:** Verify backend is running on Render and CORS is configured

### Issue: Build fails on Vercel
**Solution:** Check that all dependencies are in package.json

### Issue: White screen after deployment
**Solution:** Check browser console for errors, verify API URL is correct

### Issue: API calls timeout
**Solution:** Render free tier may sleep after inactivity. First request takes 30-60s to wake up.

## 🎯 Project URLs After Deployment

- **Frontend (Vercel):** https://your-app.vercel.app
- **Backend (Render):** https://frauddetection-9w5g.onrender.com
- **API Docs:** https://frauddetection-9w5g.onrender.com/docs
- **Health Check:** https://frauddetection-9w5g.onrender.com/health

## 🎬 For Your Video Presentation

1. **Show the live Vercel URL** - Clean, professional interface
2. **Demonstrate prediction** - Enter transaction details, get instant results
3. **Show model info** - Display accuracy metrics (99.57% recall)
4. **Explain the stack:**
   - Frontend: React + Vite (deployed on Vercel)
   - Backend: FastAPI (deployed on Render)
   - ML Model: XGBoost with 99.57% recall
   - Full Docker containerization

## 🌟 Custom Domain (Optional)
1. Purchase domain from Namecheap, GoDaddy, etc.
2. In Vercel dashboard → Project Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed by Vercel

---

**Deployment Complete! 🎉**

Your fraud detection system is now live with:
- ✅ Production-ready frontend on Vercel
- ✅ Scalable backend on Render
- ✅ Professional ML model with high accuracy
- ✅ Ready for company presentation
