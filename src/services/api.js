import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Story services
export const stories = {
  getAll: () => api.get('/stories'),
  getOne: (id) => api.get(`/stories/${id}`),
  create: (storyData) => api.post('/stories', storyData),
  update: (id, storyData) => api.put(`/stories/${id}`, storyData),
  delete: (id) => api.delete(`/stories/${id}`)
};

// Collaborator services
export const collaborators = {
  add: (storyId, collaboratorData) => api.post(`/collaborators/${storyId}`, collaboratorData),
  updateRole: (storyId, userId, role) => api.put(`/collaborators/${storyId}/${userId}`, { role }),
  remove: (storyId, userId) => api.delete(`/collaborators/${storyId}/${userId}`),
  acceptInvitation: (storyId) => api.post(`/collaborators/${storyId}/accept`),
  rejectInvitation: (storyId) => api.post(`/collaborators/${storyId}/reject`)
};

export default api; 