# 🚀 QUICK START - Get Your System Running in 5 Minutes!

## ⚡ Fastest Way (Docker - Recommended)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- That's it!

### Steps

1. **Copy your model files** to `backend/models/`:
   ```
   fraud-detection-system/backend/models/
   ├── fraud_detection_xgboost_v1.pkl
   ├── label_encoder.pkl
   ├── model_metadata.json
   └── feature_importance.json
   ```

2. **Open PowerShell** in the project root and run:
   ```powershell
   docker-compose up --build
   ```

3. **Wait 2-3 minutes** for containers to build and start

4. **Open your browser**:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

5. **Test it!**
   - Click "Sample: High Risk" button
   - Click "Analyze Transaction"
   - See the fraud prediction! 🎉

---

## 🛠️ Development Mode (Without Docker)

### Prerequisites
- Python 3.9+ ([Download](https://www.python.org/downloads/))
- Node.js 16+ ([Download](https://nodejs.org/))

### Backend Setup (Terminal 1)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy your model files to backend/models/ directory

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at: http://localhost:8000

### Frontend Setup (Terminal 2)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: http://localhost:3000

---

## 🎯 What to Do Next

### 1. Test with Sample Data
- Open http://localhost:3000 (or :80 if using Docker)
- Click one of the sample data buttons:
  - **Sample: Legitimate** - Low risk transaction
  - **Sample: Suspicious** - Medium risk transaction
  - **Sample: High Risk** - High risk fraudulent transaction
- Click "Analyze Transaction"

### 2. Try the Tabs
- **Predict Tab**: Analyze transactions
- **Feature Importance Tab**: See which features matter most
- **Model Info Tab**: View model performance metrics

### 3. Explore the API
- Visit http://localhost:8000/docs
- Try the interactive API documentation
- Test endpoints directly from your browser

---

## 📝 Important Files to Check

### Backend Configuration
**File:** `backend/.env`
```env
# Make sure these paths point to your model files
MODEL_PATH=models/fraud_detection_xgboost_v1.pkl
ENCODER_PATH=models/label_encoder.pkl
METADATA_PATH=models/model_metadata.json
FEATURE_IMPORTANCE_PATH=models/feature_importance.json
```

### Frontend Configuration
**File:** `frontend/.env`
```env
# Should point to your backend URL
VITE_API_URL=http://localhost:8000
```

---

## 🆘 Troubleshooting

### "Model files not found"
**Solution:** Copy your pickle files to `backend/models/` directory

### "Port 8000 already in use"
**Solution:** Kill the process using that port
```powershell
# Find process ID
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### "Cannot connect to backend"
**Solutions:**
1. Make sure backend is running (check Terminal 1)
2. Verify backend URL in `frontend/.env`
3. Check if http://localhost:8000/health returns `{"status":"healthy"}`

### "npm install fails"
**Solution:** Clear cache and reinstall
```powershell
rm -rf node_modules package-lock.json
npm install
```

### "pip install fails"
**Solution:** Upgrade pip and retry
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Docker Issues
**Problem:** "Cannot connect to Docker daemon"
**Solution:** Start Docker Desktop

**Problem:** "Port already allocated"
**Solution:** Stop conflicting services or change ports in `docker-compose.yml`

---

## 🎨 Key Features to Show Off

1. **Real-time Predictions**: Enter transaction data → Get instant fraud analysis
2. **Risk Classification**: Three-tier system (LOW/MEDIUM/HIGH)
3. **Visual Feedback**: Color-coded results with progress bars
4. **Feature Importance**: Interactive chart showing model insights
5. **Sample Data**: One-click testing with realistic examples
6. **Model Dashboard**: View performance metrics and health status
7. **Responsive Design**: Works on mobile, tablet, and desktop

---

## 📖 Full Documentation

For more details, see:
- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup and deployment guide
- **PROJECT_STRUCTURE.md** - Architecture and code organization
- **BUILD_COMPLETE.md** - What's been built and how to use it

---

## 🎉 Success Checklist

Before showing this to anyone, make sure:

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Sample data buttons work
- [ ] Predictions display correctly
- [ ] Feature importance chart renders
- [ ] Model info tab shows metrics
- [ ] Health check returns "healthy"
- [ ] API docs load at /docs

---

## 💡 Pro Tips

1. **Use Docker for demos** - It's the most reliable way to run the system
2. **Test with sample data first** - Verify everything works before custom inputs
3. **Show the API docs** - They're auto-generated and look professional
4. **Explain the risk levels** - Help viewers understand the business logic
5. **Highlight the performance** - 99.97% ROC-AUC is impressive!

---

## 📞 Need Help?

1. Check the error message carefully
2. Look in `backend/logs/app.log` for backend issues
3. Check browser console for frontend errors
4. Review the troubleshooting section above
5. Read SETUP.md for detailed instructions

---

## 🚀 You're Ready!

Your fraud detection system is production-ready. You can now:

- ✅ Deploy it to the cloud
- ✅ Add it to your portfolio
- ✅ Demo it in interviews
- ✅ Extend it with new features
- ✅ Share it on GitHub

**Good luck! 🎉**
