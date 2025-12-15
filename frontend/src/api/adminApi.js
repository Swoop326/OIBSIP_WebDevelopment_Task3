import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5500/api",
});

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

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      console.warn("Admin API 401 – token invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default adminApi;
