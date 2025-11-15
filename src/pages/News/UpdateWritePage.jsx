// src/pages/News/UpdateWritePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function UpdateWritePage() {
  const navigate = useNavigate();
  const { addUpdatePost } = useBoard();

  return (
    <PostForm
      breadcrumb="홈 > 교회소식 > 교회소식"
      pageTitle="교회소식"
      onSubmit={(data) => {
        addUpdatePost(data);
        navigate("/news/updates");
      }}
      onCancel={() => navigate("/news/updates")}
    />
  );
}
