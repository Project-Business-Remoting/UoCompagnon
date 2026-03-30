const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('uo_admin_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data;
};

// Auth
export const loginUser = (email, password) =>
  request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Dashboard Admin
export const fetchAdminDashboard = () => request('/dashboard/admin');

// Contents CRUD
export const fetchAllContents = () => request('/contents');

export const createContent = (data) =>
  request('/contents', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateContent = (id, data) =>
  request(`/contents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteContent = (id) =>
  request(`/contents/${id}`, {
    method: 'DELETE',
  });
