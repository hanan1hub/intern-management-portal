import api from './axiosInstance';

export const getAll = (params) => api.get('/attendance', { params });
export const mark   = (data)   => api.post('/attendance', data);
