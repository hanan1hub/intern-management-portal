import api from './axiosInstance';

export const getAll      = (params) => api.get('/tasks', { params });
export const create      = (data)   => api.post('/tasks', data);
export const updateStatus = (id, status) => api.put(`/tasks/${id}`, { status });
