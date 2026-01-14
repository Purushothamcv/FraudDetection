import React, { useState, useEffect } from 'react';
import { Shield, BarChart3, Info, AlertTriangle } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import PredictionResult from './components/PredictionResult';
import FeatureImportance from './components/FeatureImportance';
import ModelInfo from './components/ModelInfo';
import ShinyText from './components/ShinyText';
import { predictTransaction, wakeUpBackend } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [prediction, setPrediction] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, awake, sleeping

  // Wake up backend on component mount
  useEffect(() => {
    const wakeBackend = async () => {
      setBackendStatus('checking');
      const isAwake = await wakeUpBackend();
      setBackendStatus(isAwake ? 'awake' : 'sleeping');
    };
    wakeBackend();
  }, []);

  const handlePrediction = async (transactionData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await predictTransaction(transactionData);
      setPrediction(result);
      setTransactionData(transactionData);
      setBackendStatus('awake'); // Backend responded successfully
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('prediction-result')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (err) {
      setError(err.message || 'Failed to analyze transaction');
      console.error('Prediction error:', err);
      if (err.message.includes('waking up')) {
        setBackendStatus('sleeping');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'predict', label: 'Predict', icon: Shield },
    { id: 'features', label: 'Feature Importance', icon: BarChart3 },
    { id: 'model', label: 'Model Info', icon: Info }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  <ShinyText 
                    text="Fraud Detection System"
                    speed={3}
                    color="#111827"
                    shineColor="#3b82f6"
                    spread={100}
                  />
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  AI-Powered Financial Transaction Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-success-50 border border-success-200 px-3 sm:px-4 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === 'awake' ? 'bg-success-500 animate-pulse' :
                backendStatus === 'sleeping' ? 'bg-warning-500' :
                'bg-gray-400 animate-pulse'
              }`}></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {backendStatus === 'awake' ? 'System Active' :
                 backendStatus === 'sleeping' ? 'Waking up server...' :
                 'Checking status...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap
                    border-b-2 transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-danger-800">Error</h3>
                <p className="text-sm text-danger-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-danger-600 hover:text-danger-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'predict' && (
          <div className="space-y-8">
            <TransactionForm onSubmit={handlePrediction} isLoading={isLoading} />
            
            {prediction && (
              <div id="prediction-result">
                <PredictionResult result={prediction} transactionData={transactionData} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'features' && <FeatureImportance />}
        
        {activeTab === 'model' && <ModelInfo />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>© 2024 Fraud Detection System. Built with React, FastAPI & XGBoost.</p>
            <p className="mt-1">
              <span className="font-semibold">Model Performance:</span> 99.97% ROC-AUC | 98.97% Recall
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
