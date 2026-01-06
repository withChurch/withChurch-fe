// src/pages/News/UpdateWritePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function UpdateWritePage() {
  const navigate = useNavigate();
  const { addUpdatePost } = useBoard();

  const handleSubmit = (data) => {
    const newPost = addUpdatePost(data); // data = { title, content, files }
    navigate(`/news/updates/${newPost.id}`); // 저장 후 상세페이지로 이동
  };   

  return (
    <PostForm
      breadcrumb="홈 > 교회소식 > 글쓰기"
      pageTitle="교회소식"
      onSubmit={handleSubmit} 
      onCancel={() => navigate("/news/updates")}
    />
  );
}
