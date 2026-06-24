import api from './axiosInstance';

export const getMe           = ()          => api.get('/intern/me');
export const getMyTasks      = ()          => api.get('/intern/tasks');
export const getMyAttendance = ()          => api.get('/intern/attendance');

export const submitTask = (id, { note, file }) => {
  const fd = new FormData();
  if (note) fd.append('submission_note', note);
  if (file) fd.append('file', file);
  return api.put(`/intern/tasks/${id}/submit`, fd);
};

/* Build the URL to a stored upload file (works in dev via Vite proxy and in prod) */
export const fileUrl = (filename) => {
  if (!filename) return null;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '');
  return `${base}/uploads/${filename}`;
};
