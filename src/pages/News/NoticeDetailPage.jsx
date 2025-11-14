import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Paperclip } from "lucide-react";
import PostDetail from "../../components/board/PostDetail";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  // 임시 더미 데이터 (공지사항용)
  const post = {
    title: "11월 첫째 주 교회 소식 안내",
    date: "2025-11-02",
    content: `11월 첫째 주 교회 소식을 안내드립니다.

1. 새가족 환영 모임이 예배 후 1시 교육관 3층에서 있습니다.
2. 이번 주 중보기도 모임은 수요일 저녁 8시에 본당에서 진행됩니다.
3. 청년부 수련회 신청은 사무실에서 받고 있습니다.`,
    file: "2025-11-02_교회소식.pdf",
  };

  const comments = [
    {
      author: "관리자",
      date: "2025-11-02",
      content: "궁금한 사항은 교회 사무실로 문의해주세요.",
    },
  ];
  const fromTop = location.state?.from === "updates-top";

  return (
    <PostDetail
      breadcrumb="◦ 교회소식 > 공지사항"
      title={post.title}
      date={post.date}
      content={post.content}
      file={post.file}
      comments={comments}
      onBack={() => navigate(fromTop ? "/news/updates" : "/news/notices")}
    />
  );
}
export default NoticeDetailPage;
