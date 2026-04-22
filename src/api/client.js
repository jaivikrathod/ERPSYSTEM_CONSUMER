import axios from 'axios';
import { attachRequestInterceptor } from '../interceptors/requestInterceptor';
import { attachResponseInterceptor } from '../interceptors/responseInterceptor';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/consumer',
  headers: {
    'Content-Type': 'application/json',
  },
});

attachRequestInterceptor(apiClient);
attachResponseInterceptor(apiClient);

export default apiClient;

