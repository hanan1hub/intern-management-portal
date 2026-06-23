import api from './axiosInstance';

export const login         = (credentials) => api.post('/auth/login',        credentials);
export const internLogin   = (credentials) => api.post('/auth/intern-login',  credentials);
export const getProfile    = ()            => api.get('/auth/me');
export const updateProfile = (data)        => api.put('/auth/profile',        data);
