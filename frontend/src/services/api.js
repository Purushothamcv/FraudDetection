/**
 * API Service for communicating with the fraud detection backend.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds (2 minutes) - Render free tier can take 50-90s to wake up
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

/**
 * Wake up the backend server (Render free tier sleeps after inactivity)
 */
export const wakeUpBackend = async () => {
  try {
    const healthUrl = `${API_BASE_URL}/health`;
    await axios.get(healthUrl, { timeout: 120000 });
    return true;
  } catch (error) {
    console.warn('Backend wake-up check failed:', error.message);
    return false;
  }
};

/**
 * Predict fraud for a single transaction with retry logic
 */
export const predictTransaction = async (transactionData, retryCount = 0) => {
  try {
    const response = await apiClient.post('/predictions/single', transactionData);
    return response.data;
  } catch (error) {
    // Retry once if timeout on first attempt (backend might be waking)
    if ((error.code === 'ECONNABORTED' || error.message.includes('timeout')) && retryCount === 0) {
      console.log('First attempt timed out, retrying once...');
      // Wait 3 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 3000));
      return predictTransaction(transactionData, retryCount + 1);
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Server is still waking up. This can take up to 2 minutes on first use. Please wait a moment and try again.');
    }
    throw new Error(error.response?.data?.detail?.message || 'Failed to predict transaction');
  }
};

/**
 * Predict fraud for multiple transactions in batch
 */
export const predictBatchTransactions = async (transactions) => {
  try {
    const response = await apiClient.post('/predictions/batch', { transactions });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail?.message || 'Failed to predict batch transactions');
  }
};

/**
 * Get model information
 */
export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/model/info');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch model information');
  }
};

/**
 * Get feature importance
 */
export const getFeatureImportance = async () => {
  try {
    const response = await apiClient.get('/model/feature-importance');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch feature importance');
  }
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/model/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};

/**
 * Approve a transaction
 */
export const approveTransaction = async (transactionData) => {
  try {
    const response = await apiClient.post('/predictions/approve', transactionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail?.message || 'Failed to approve transaction');
  }
};

export default {
  predictTransaction,
  predictBatchTransactions,
  getModelInfo,
  getFeatureImportance,
  checkHealth,
  approveTransaction,
};
