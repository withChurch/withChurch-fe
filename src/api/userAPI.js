import api from "./axios";

export const updateMyInfo = (data) =>
  api.patch("/api/users/me", data);

export const changePassword = (data) =>
  api.patch("/api/users/me/password", data);

export const adminGetAllUsers = () =>
  api.get("/api/admin/users");

export const adminUpdateUserRole = (userId, payload) =>
  api.patch(`/api/admin/users/${userId}`, payload);
