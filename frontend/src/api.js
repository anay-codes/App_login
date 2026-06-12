import axios from "axios";

const api = axios.create({
  baseURL: "https://app-login-po50.onrender.com/api",
  timeout: 15000
});

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

axios.interceptors.request.use(attachToken);
api.interceptors.request.use(attachToken);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profile");
    }
    return Promise.reject(error);
  }
);

export default api;
