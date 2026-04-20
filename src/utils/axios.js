import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Create a centralized axios instance
const axiosInstance = axios.create({
  // Base URL from environment or fallback to localhost
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Dispatch logout action to clear state and local storage
      store.dispatch(logout());
      
      // Optionally redirect to login, but usually state change handles this via routes
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
