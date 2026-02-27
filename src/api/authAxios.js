// src/api/authAxios.js
import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // refresh 쿠키 쓰면 유지
});

authAxios.interceptors.request.use(
  (config) => {
    config.headers["X-Church-Domain"] = window.location.hostname;
    return config;
  },
  (error) => Promise.reject(error)
);

export default authAxios;
