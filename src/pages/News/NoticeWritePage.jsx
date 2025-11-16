// src/pages/News/NoticeWritePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function NoticeWritePage() {
  const navigate = useNavigate();
  const { addNoticePost } = useBoard();

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
