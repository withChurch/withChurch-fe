// src/pages/Community/BoardWritePage.jsx
import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../../contexts/BoardContext";

export default function BoardWritePage() {
  const navigate = useNavigate();
  const { addPost } = useBoard();

  const handleSubmit = (data) => {
    const newPost = addPost(data); // data = { title, content, files }
    navigate(`/community/board/${newPost.id}`); // 저장 후 상세페이지로 이동
  };

  return (
    <PostForm
      breadcrumb="홈 > 소통과 공감 > 자유게시판"
      pageTitle="자유게시판"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/community/board")}
    />
  );
}
