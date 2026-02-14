import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get Firebase ID token
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (error) {
      console.error('Error getting ID token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 errors (token expired, etc.)
    if (error.response?.status === 401) {
      console.error('Unauthorized - Token may be expired');
      // Could trigger re-authentication here if needed
    }

    return Promise.reject(error);
  }
);

export default api;
