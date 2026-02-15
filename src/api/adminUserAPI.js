// src/api/adminUserAPI.js
import api from "./axios";

/**
 * 전체 유저 조회 (필터링 가능)
 * GET /api/admin/users  (baseURL에 /api 포함되어 있으므로 여기서는 /admin/users)
 */
export const getAdminUsers = async (params = {}) => {
  const res = await api.get("/admin/users", { params });
  return res.data; // { success, code, message, data: { content: [...] } }
};

// 단일 조회
export const getAdminUserDetail = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

// 권한/상태 수정
export const updateAdminUser = async (id, role, state) => {
  const res = await api.patch(`/admin/users/${id}`, {
    role,
    state,
  });
  return res.data;
};

export const withdrawAdminUser = async (id, role) => {
  const res = await api.patch(`/admin/users/${id}`, {
    role:role,
    state: "WITHDRAWN",
  });
  return res.data;
};
