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
  timeout: 90000, // 90 seconds - Render free tier takes 50s to wake up
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
    await axios.get(healthUrl, { timeout: 90000 });
    return true;
  } catch (error) {
    console.warn('Backend wake-up failed, but will retry with main request:', error.message);
    return false;
  }
};

/**
 * Predict fraud for a single transaction
 */
export const predictTransaction = async (transactionData) => {
  try {
    const response = await apiClient.post('/predictions/single', transactionData);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Backend is waking up (takes ~50 seconds on Render free tier). Please try again in a moment.');
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
