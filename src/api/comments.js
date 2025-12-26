// src/api/comments.js
import axiosInstance from "./axiosInstance";

export const getCommentsByPostId = (postId) =>
  axiosInstance.get(`/posts/${postId}/comments`);

export const createComment = (postId, content) =>
  axiosInstance.post(`/posts/${postId}/comments`, { content });

export const updateCommentById = (commentId, content) =>
  axiosInstance.put(`/comments/${commentId}`, { content });

export const deleteCommentById = (commentId) =>
  axiosInstance.delete(`/comments/${commentId}`);
