// src/api/authAxios.js
import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

authAxios.interceptors.request.use(
  (config) => {
    const host = window.location.hostname;

    const devChurchDomain = import.meta.env.VITE_CHURCH_DOMAIN;

    const domain =
      (host === "localhost" || host === "127.0.0.1") && devChurchDomain
        ? devChurchDomain
        : host;

    if (config.headers?.set) {
      config.headers.set("x-church-domain", domain);
    } else {
      config.headers = config.headers || {};
      config.headers["x-church-domain"] = domain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default authAxios;