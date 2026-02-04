import api from "./axios";

// 게시글별 댓글 조회
export const getCommentsByPost = (postId) => {
  return api.get("/comments", {
    params: {
      postId,
    },
  });
};

// 전체 댓글 조회 (필요시)
export const getAllComments = () => api.get("/comments");

// 댓글 생성
export const createComment = (data) => api.post("/comments", data);

// 댓글 수정
export const updateComment = (commentId, data) => api.patch(`/comments/${commentId}`, data);

// 댓글 삭제
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

