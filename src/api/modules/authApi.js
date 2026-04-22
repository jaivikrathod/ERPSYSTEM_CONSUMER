import apiClient from '../client';

export const loginApi = (payload) => apiClient.post('/login', payload);

export const registerApi = (payload) => apiClient.post('/register', payload);

