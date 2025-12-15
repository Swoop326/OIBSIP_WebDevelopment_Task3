import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5500/api",
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚫 DO NOT LOG OUT AUTOMATICALLY
    if (error.response?.status === 401) {
      console.warn("Admin API 401 – token invalid or expired");
      // Just reject, page will handle it
    }
    return Promise.reject(error);
  }
);

export default adminApi;
