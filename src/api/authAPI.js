import api from "./axios";

export const loginAPI = (loginId, password) =>
  api.post("/api/auth/login", { loginId, password });

export const signupAPI = (data) =>
  api.post("/api/auth/signup", data);

export const logoutAPI = () =>
  api.post("/api/auth/logout");

export const refreshAPI = () =>
  api.post("/api/auth/refresh");

export const meAPI = () =>
  api.get("/api/users/me");
