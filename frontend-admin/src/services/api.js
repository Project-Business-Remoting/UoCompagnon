const API_BASE = '/api';

const getHeaders = () => {
  return { 'Content-Type': 'application/json' };
};

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders(),
    credentials: 'include', // Important pour envoyer les cookies
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

export const logoutAdmin = () =>
  request('/users/logout', { method: 'POST' });

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

// Questions Admin API
export const getAllQuestions = () => request('/questions');
export const replyToQuestion = (id, answer) =>
  request(`/questions/${id}/reply`, {
    method: 'PUT',
    body: JSON.stringify({ answer })
  });

