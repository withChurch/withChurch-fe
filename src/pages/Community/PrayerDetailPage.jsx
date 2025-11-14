// src/pages/Prayer/PrayerDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import PostDetail from "../../components/board/PostDetail";

const PrayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 임시 더미 데이터, API연동예정
  const post = {
    title: "중보기도 요청드립니다",
    date: "2025-11-03",
    content: `이번 주 수술을 앞두고 있습니다.
기도 부탁드립니다.`,
    file: "prayer_request.pdf",
  };

  const comments = [
    {
      author: "김은혜",
      date: "2025-11-03",
      content: "함께 기도하겠습니다. 힘내세요!",
    },
  ];

  return (
    <PostDetail
      breadcrumb="◦ 소통과 공감 > 중보기도"
      title={post.title}
      date={post.date}
      content={post.content}
      file={post.file}
      comments={comments}
      onBack={() => navigate("/community/prayer")}
    />
  );
}

export default PrayerDetailPage;
