import api from './axiosInstance';

export const getMe           = ()          => api.get('/intern/me');
export const getMyTasks      = ()          => api.get('/intern/tasks');
export const submitTask      = (id, data)  => api.put(`/intern/tasks/${id}/submit`, data);
export const getMyAttendance = ()          => api.get('/intern/attendance');
