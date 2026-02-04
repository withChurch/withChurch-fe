import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function SundaySermonWritePage() {
  const navigate = useNavigate();
  const { addSundayPost } = useBoard();

  const handleSubmit = async (data) => {
    try {
      const newPost = await addSundayPost(data);

      alert("주일예배 말씀이 등록되었습니다.");

      if (newPost && newPost.postId) {
        navigate(`/sermon/sunday/${newPost.postId}`);
      } else {
        navigate("/sermon/sunday");
      }

    } catch (error) {
      console.error("작성 실패:", error);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <PostForm
      breadcrumb="◦ 생명의 말씀 > 주일예배 > 글쓰기"
      pageTitle="주일예배 작성"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/sermon/sunday")}
    />
  );
}