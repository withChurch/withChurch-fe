import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";

export default function UpdateWritePage() {
  const navigate = useNavigate();
  
  return (
    <PostForm
      breadcrumb="홈 > 교회소식 > 교회소식"
      pageTitle="교회소식"
      onCancel={() => navigate("/news/updates")}

    />
  );
}
