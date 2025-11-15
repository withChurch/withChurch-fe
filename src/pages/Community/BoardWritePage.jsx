import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";

export default function BoardWritePage() {
  const navigate = useNavigate();

  return (
    <PostForm
      breadcrumb="홈 > 소통과 공감 > 자유게시판"
      pageTitle="자유게시판"
      onCancel={() => navigate("/community/board")}
    />
  );
}
