import api from "./axios";

export const getPostsByBoard = (
  boardId,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
  keyword = ""
) => {
  const params = { boardId, page, size };

  if (sort !== undefined && sort !== null && sort !== "") {
    params.sort = sort;
  }

  const kw = (keyword ?? "").trim();
  if (kw) {
    params.keyword = kw;
  }

  return api.get("/posts", { params });
};

// 게시판 목록 조회
export const getAllBoards = () => api.get("/boards");

// 게시글 상세 조회
export const getPost = (postId) => api.get(`/posts/${postId}`);

// 게시글 생성
export const createPost = (data) => {
  // data = { title, content, boardId, attachmentIds, imageIds }
  return api.post("/posts", data);
};

// 게시글 수정
export const updatePost = (postId, data) => api.patch(`/posts/${postId}`, data);

// 게시글 삭제
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

