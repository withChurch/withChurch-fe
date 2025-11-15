import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";

export default function PrayerWritePage() {
    const navigate = useNavigate();

  return (
    <PostForm
      breadcrumb="홈 > 소통과 공감 > 중보기도"
      pageTitle="중보기도"
      onCancel={() => navigate("/community/prayer")}
      
    />
  );
}
