import apiClient from '../client';

export const getTasksApi = () => apiClient.get('/tasks');

