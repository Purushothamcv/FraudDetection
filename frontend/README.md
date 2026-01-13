# Fraud Detection System - Frontend

Modern React-based web interface for the fraud detection system.

## Features

- **Interactive Transaction Form**: Easy-to-use form with validation and sample data
- **Real-time Predictions**: Instant fraud analysis with visual feedback
- **Feature Importance Visualization**: Interactive charts showing model insights
- **Model Information Dashboard**: Comprehensive model metrics and health status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Axios**: HTTP client
- **Lucide React**: Beautiful icon library

## Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The development server runs on `http://localhost:3000` and automatically proxies API requests to the backend at `http://localhost:8000`.

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/           # React components
│   ├── TransactionForm.jsx    # Transaction input form
│   ├── PredictionResult.jsx   # Prediction display
│   ├── FeatureImportance.jsx  # Feature importance chart
│   └── ModelInfo.jsx          # Model information dashboard
├── services/            # API services
│   └── api.js          # API client and endpoints
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Features

### Transaction Analysis
- Form validation for all input fields
- Sample data buttons for testing
- Real-time fraud probability calculation
- Risk level classification (LOW, MEDIUM, HIGH)
- Recommended actions based on risk

### Visualizations
- Feature importance bar chart
- Confidence score indicators
- Performance metrics dashboard
- Model health monitoring

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly controls
- Optimized for all screen sizes

## API Integration

The frontend communicates with the FastAPI backend through REST endpoints:

- `POST /api/v1/predictions/single` - Analyze single transaction
- `GET /api/v1/model/info` - Get model information
- `GET /api/v1/model/feature-importance` - Get feature importance
- `GET /api/v1/model/health` - Health check

## Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent styling with Tailwind
4. Write accessible HTML
5. Test on multiple browsers

## License

MIT License
