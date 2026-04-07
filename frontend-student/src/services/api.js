const API_BASE = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  return { "Content-Type": "application/json" };
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

export const registerUser = (userData) =>
  request("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const logoutUser = () => request("/users/logout", { method: "POST" });

export const fetchProfile = () => request("/users/profile");
export const updateProfile = (profileData) =>
  request("/users/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

// Dashboard
export const fetchDashboard = () => request("/dashboard");

// Contenus
export const fetchRelevantContents = () => request("/contents/relevant");
export const fetchAllContents = (step) =>
  request(`/contents${step ? `?step=${encodeURIComponent(step)}` : ""}`);

// Notifications
export const fetchSmartNotifications = () => request("/notifications/smart");
export const markAllNotificationsRead = () =>
  request("/notifications/mark-read", { method: "PUT" });
export const markNotificationRead = (id) =>
  request(`/notifications/mark-read/${id}`, { method: "PUT" });
export const deleteNotification = async (id) => {
  return await request(`/notifications/${id}`, { method: "DELETE" });
};

// Questions API
export const getMyQuestions = () => request("/questions/mine");
export const getAllQuestions = () => request("/questions");
export const createQuestion = (questionData) =>
  request("/questions", { method: "POST", body: JSON.stringify(questionData) });
export const replyToQuestion = (id, answer) =>
  request(`/questions/${id}/reply`, {
    method: "PUT",
    body: JSON.stringify({ answer }),
  });

// FAQs API
export const fetchAllFAQs = () => request("/faqs");
