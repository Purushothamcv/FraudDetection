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
  timeout: 30000, // 30 seconds
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
 * Predict fraud for a single transaction
 */
export const predictTransaction = async (transactionData) => {
  try {
    const response = await apiClient.post('/predictions/single', transactionData);
    return response.data;
  } catch (error) {
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
