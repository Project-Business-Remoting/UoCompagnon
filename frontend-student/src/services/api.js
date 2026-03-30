const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('uo_token');
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

export const registerUser = (userData) =>
  request('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const fetchProfile = () => request('/users/profile');

// Dashboard
export const fetchDashboard = () => request('/dashboard');

// Contenus
export const fetchRelevantContents = () => request('/contents/relevant');
export const fetchAllContents = (step) =>
  request(`/contents${step ? `?step=${encodeURIComponent(step)}` : ''}`);

// Notifications
export const fetchSmartNotifications = () => request('/notifications/smart');
export const markAllNotificationsRead = () =>
  request('/notifications/mark-read', { method: 'PUT' });
export const markNotificationRead = (id) =>
  request(`/notifications/mark-read/${id}`, { method: 'PUT' });
export const deleteNotification = async (id) => {
  return await request(`/notifications/${id}`, { method: 'DELETE' });
};

// Questions API
export const getMyQuestions = () => request('/questions/mine');
export const getAllQuestions = () => request('/questions');
export const createQuestion = (questionData) =>
  request('/questions', { method: 'POST', body: JSON.stringify(questionData) });
export const replyToQuestion = (id, answer) =>
  request(`/questions/${id}/reply`, { method: 'PUT', body: JSON.stringify({ answer }) });

