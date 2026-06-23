import api from './axiosInstance';

export const getAll    = (params) => api.get('/interns', { params });
export const getOne    = (id)     => api.get(`/interns/${id}`);
export const create    = (data)   => api.post('/interns', data);
export const update    = (id, data) => api.put(`/interns/${id}`, data);
export const remove    = (id)     => api.delete(`/interns/${id}`);
