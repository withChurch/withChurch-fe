// src/pages/News/UpdateDetailPage.jsx (예시 경로)
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import PostDetail from "../../components/board/PostDetail";

const UpdateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 임시 더미 데이터 (교회소식용)
  const post = {
    title: "11월 첫째 주 사역 및 일정 업데이트",
    date: "2025-11-04",
    content: `이번 주 사역 및 일정을 안내드립니다.

- 월요일: 새벽기도 5시, 본당
- 수요일: 수요예배 및 중보기도 모임
- 토요일: 청년부 리더모임 오후 4시, 교육관 2층

섬김에 감사드립니다.`,
    file: "2025-11-week1_update.pdf",
  };

  const comments = [
    {
      author: "담임목사",
      date: "2025-11-04",
      content: "함께 기도로 준비하며 한 주를 걸어가길 축복합니다.",
    },
  ];
  const fromUpdatesTop = location.state?.from === "updates-top";

  return (
    <PostDetail
      breadcrumb="◦ 교회소식 > 교회소식"
      title={post.title}
      date={post.date}
      content={post.content}
      file={post.file}
      comments={comments}
      onBack={() => navigate("/news/updates")}
    />
  );
}
export default UpdateDetailPage;
