import axios from "./axios";

export const loginAPI = (loginId, password) =>
  axios.post("/auth/login", { loginId, password });

export const signupAPI = (data) =>
  axios.post("/auth/signup", data);

export const logoutAPI = () =>
  axios.post("/auth/logout");

export const refreshAPI = () =>
  axios.post("/auth/refresh");

export const findPassword = (data) => axios.post("/auth/find-password", data);

export const verifyCode = (data) => axios.post("/auth/verify-code", data);

export const resetPassword = (data) => axios.post("/auth/reset-password", data);

export const findId = (data) => axios.post("/auth/find-id", data);
