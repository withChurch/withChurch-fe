import axios from "./axiosInstance"; 

// 게시판별 게시글 목록 조회
export const getPosts = async (boardId) => {
  const res = await axios.get("/posts", {
    params: { boardId },
  });
  return res.data.data.content; // 배열
};

// 게시글 단건 조회
export const getPostById = async (postId) => {
  const res = await axios.get(`/posts/${postId}`);
  return res.data.data;
};

// 게시글 작성
export const createPost = async ({ title, content, boardId }) => {
  const res = await axios.post("/posts", {
    title,
    content,
    boardId,
  });
  return res.data.data; // 단건 객체
};

// 게시글 삭제
export const deletePostById = async (postId) => {
  await axios.delete(`/posts/${postId}`);
};

// 조회수 증가
export const increasePostView = async (postId) => {
  await axios.post(`/posts/${postId}/view`);
};
