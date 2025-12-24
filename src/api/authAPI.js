import authAxios from "./authAxios";

export const loginAPI = (loginId, password) =>
  authAxios.post("/auth/login", { loginId, password });

export const signupAPI = (data) =>
  authAxios.post("/auth/signup", data);

export const logoutAPI = () =>
  authAxios.post("/auth/logout");

export const refreshAPI = () =>
  authAxios.post("/auth/refresh");
