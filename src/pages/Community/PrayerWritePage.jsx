// src/pages/Community/PrayerWritePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function PrayerWritePage() {
  const navigate = useNavigate();
  const { addPrayerPost } = useBoard();

  return (
    <PostForm
      breadcrumb="홈 > 소통과 공감 > 중보기도"
      pageTitle="중보기도"
      onSubmit={(data) => {
        addPrayerPost(data);
        navigate("/community/prayer");
      }}
      onCancel={() => navigate("/community/prayer")}
    />
  );
}
