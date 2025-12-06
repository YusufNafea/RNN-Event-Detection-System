/**
 * API Service
 * File: frontend/src/services/api.js
 * 
 * Handles all HTTP requests to Flask backend
 */

import axios from 'axios';

// Base URL for API (Flask backend)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for logging, auth, etc.)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.data);
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('API No Response:', error.request);
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Error setting up request
      console.error('API Request Error:', error.message);
      throw new Error(error.message);
    }
  }
);

/**
 * API Service Object
 */
const api = {
  /**
   * Check API health status
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  /**
   * Get model information
   * @returns {Promise<Object>} Model details
   */
  async getModelInfo() {
    const response = await apiClient.get('/api/model-info');
    return response.data;
  },

  /**
   * Predict single sequence
   * @param {Array} sequence - Array of shape (20, 4)
   * @returns {Promise<Object>} Prediction result
   */
  async predictSingle(sequence) {
    const response = await apiClient.post('/api/predict', {
      sequence: sequence,
    });
    return response.data;
  },

  /**
   * Predict multiple sequences
   * @param {Array} sequences - Array of sequences
   * @returns {Promise<Object>} Batch prediction results
   */
  async predictBatch(sequences) {
    const response = await apiClient.post('/api/predict-batch', {
      sequences: sequences,
    });
    return response.data;
  },

  /**
   * Upload CSV file for prediction
   * @param {File} file - CSV file
   * @param {Function} onProgress - Progress callback (optional)
   * @returns {Promise<Object>} Prediction results
   */
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    });

    return response.data;
  },
};

export default api;
