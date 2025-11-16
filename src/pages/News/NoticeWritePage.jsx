// src/pages/News/NoticeWritePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function NoticeWritePage() {
  const navigate = useNavigate();
  const { addNoticePost } = useBoard();

   const handleSubmit = (data) => {
    const newPost = addPost(data); // data = { title, content, files }
    navigate(`/news/notices/${newPost.id}`); // 저장 후 상세페이지로 이동
  };  
  return (
    <PostForm
      breadcrumb="홈 > 교회소식 > 공지사항"
      pageTitle="공지사항"
      onSubmit={(data) => {
        addNoticePost(data);
        navigate("/news/notices");
      }}
      onCancel={() => navigate("/news/notices")}
    />
  );
}
