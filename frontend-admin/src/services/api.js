const envUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.trim() : null;
const API_BASE = envUrl || "/api";

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  try {
    const savedUser = localStorage.getItem("uo_admin_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        const cleanToken = user.token.replace(/[\r\n\t]/g, '').trim();
        headers["Authorization"] = `Bearer ${cleanToken}`;
      }
    }
  } catch (e) {
    // Ignore parse errors from corrupted localStorage
  }
  return headers;
};

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders(),
    credentials: "include", // Important pour envoyer les cookies
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  if (data === null) {
    return {};
  }

  return data;
};

// Auth
export const loginUser = (email, password) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logoutAdmin = () => request("/users/logout", { method: "POST" });

// Dashboard Admin
export const fetchAdminDashboard = () => request("/dashboard/admin");

// Contents CRUD
export const fetchAllContents = () => request("/contents");

export const createContent = (data) =>
  request("/contents", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateContent = (id, data) =>
  request(`/contents/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteContent = (id) =>
  request(`/contents/${id}`, {
    method: "DELETE",
  });

// Questions Admin API
export const getAllQuestions = () => request("/questions");
export const replyToQuestion = (id, answer) =>
  request(`/questions/${id}/reply`, {
    method: "PUT",
    body: JSON.stringify({ answer }),
  });

// Notifications Admin API
export const fetchNotifications = () => request("/notifications");
export const createNotificationApi = (data) =>
  request("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteNotificationApi = (id) =>
  request(`/notifications/${id}`, {
    method: "DELETE",
  });

// Students Directory Admin API
export const fetchAllStudents = () => request("/users/students");
export const updateStudentPhotoStatus = (id, status) => 
  request(`/users/students/${id}/photo-status`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });

// FAQ Admin API
export const fetchAllFAQs = () => request("/faqs");
export const createFAQ = (data) =>
  request("/faqs", { method: "POST", body: JSON.stringify(data) });
export const updateFAQ = (id, data) =>
  request(`/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteFAQ = (id) =>
  request(`/faqs/${id}`, { method: "DELETE" });
