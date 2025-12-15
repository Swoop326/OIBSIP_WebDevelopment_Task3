import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:5500/api",
});

userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("User API 401 – token invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default userApi;
