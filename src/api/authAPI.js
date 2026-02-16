import authAxios from "./authAxios";

export const loginAPI = (loginId, password) =>
  authAxios.post("/auth/login", { loginId, password });

export const signupAPI = (data) =>
  authAxios.post("/auth/signup", data);

export const logoutAPI = () =>
  authAxios.post("/auth/logout");

export const refreshAPI = () =>
  authAxios.post("/auth/refresh");

export const findPassword = (data) => authAxios.post("/auth/find-password", data);

export const verifyCode = (data) => authAxios.post("/auth/verify-code", data);

export const resetPassword = (data) => authAxios.post("/auth/reset-password", data);

export const findId = (data) => authAxios.post("/auth/find-id", data);
