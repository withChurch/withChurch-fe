import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../../contexts/BoardContext";

export default function BoardWritePage() {
  const navigate = useNavigate();
  const { addPost } = useBoard(); 
  return (
    <PostForm
      breadcrumb="홈 > 소통과 공감 > 자유게시판"
      pageTitle="자유게시판"
      onSubmit={(data) => {
        addPost(data);
        navigate("/community/board");
      }}
      onCancel={() => navigate("/community/board")}
    />
  );
}
