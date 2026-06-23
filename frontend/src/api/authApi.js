import api from './axiosInstance';

export const login           = (data) => api.post('/auth/login',            data);
export const internLogin     = (data) => api.post('/auth/intern-login',     data);
export const getProfile      = ()     => api.get('/auth/me');
export const updateProfile   = (data) => api.put('/auth/profile',           data);
export const forgotPassword  = (data) => api.post('/auth/forgot-password',  data);
export const resetPassword   = (data) => api.post('/auth/reset-password',   data);
