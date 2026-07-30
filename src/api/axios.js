// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

export function resolveChurchDomain() {
  const host = window.location.hostname.toLowerCase().replace(/^www\./, "");
  const devChurchDomain = import.meta.env.VITE_CHURCH_DOMAIN;

  if ((host === "localhost" || host === "127.0.0.1") && devChurchDomain) {
    return devChurchDomain;
  }
  return host;
}

api.interceptors.request.use((config) => {
  config.headers ??= {};

  const domain = resolveChurchDomain();

  if (typeof config.headers.set === "function") {
    config.headers.set("X-Church-Domain", domain);
  } else {
    config.headers["X-Church-Domain"] = domain;
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    const raw = token.startsWith("Bearer ") ? token.slice(7) : token;
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${raw}`);
    } else {
      config.headers.Authorization = `Bearer ${raw}`;
    }
  }

  return config;
});

export default api;
