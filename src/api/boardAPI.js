import api from "./axios";

// 게시판 목록 조회
export const getAllBoards = () => api.get("/boards");

// 게시판별 게시글 목록 조회
export const getPostsByBoard = (boardId, page = 0, size = 10, sort = "createdAt,desc") => {
  return api.get("/posts", {
    params: {
      boardId,
      page,
      size,
      sort,
    },
  });
};

// 게시글 상세 조회
export const getPost = (postId) => api.get(`/posts/${postId}`);

// 게시글 생성
export const createPost = (data) => api.post("/posts", data);

// 게시글 수정
export const updatePost = (postId, data) => api.patch(`/posts/${postId}`, data);

// 게시글 삭제
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

