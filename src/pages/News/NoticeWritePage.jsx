import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";

export default function NoticeWritePage() {
  const navigate = useNavigate();

  return (
    <PostForm
      breadcrumb="홈 > 교회소식 > 공지사항"
      pageTitle="공지사항"
      onCancel={() => navigate("/news/notices")}

    />
  );
}
