import api from "./axios";

// 내 프로필 조회
export const getMyProfile = () =>
  api.get("/users/me");

// 회원 탈퇴
export const deleteMyAccount = (currentPassword) =>
  api.delete("/users/me", {
    data: {
      currentPassword,
    },
  });


// 내 정보 수정
export const updateMyInfo = (data) =>
  api.patch("/users/me", data);

// 비밀번호 변경
export const changePassword = (data) =>
  api.patch("/users/me/password", data);

// 관리자
export const adminGetAllUsers = () =>
  api.get("/admin/users");

export const adminUpdateUserRole = (userId, payload) =>
  api.patch(`/admin/users/${userId}`, payload);
