import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";

export default function DawnSermonWritePage() {
  const navigate = useNavigate();
  const { addDawnPost } = useBoard();

  const handleSubmit = async (data) => {
    try {
      const newPost = await addDawnPost(data);

      alert("새벽예배 말씀이 등록되었습니다.");
      const newId = newPost?.postId || newPost?.id;

      if (newId) {
        navigate(`/sermon/dawn/${newId}`);
      } else {
        navigate("/sermon/dawn");
      }

    } catch (error) {
      console.error("작성 실패:", error);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <PostForm
      breadcrumb="◦ 생명의 말씀 > 새벽예배 > 글쓰기"
      pageTitle="새벽예배 작성"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/sermon/dawn")}
    />
  );
}