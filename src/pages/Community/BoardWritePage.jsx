import React from "react";
import PostForm from "../../components/board/PostForm";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../../contexts/BoardContext";

export default function BoardWritePage() {
  const navigate = useNavigate();
  
  const { addPost, boardMap } = useBoard();

  const targetBoardId = boardMap ? boardMap["자유게시판"] : null;

  const handleSubmit = async (data) => {
    if (!targetBoardId) {
      alert("게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {

      const safeImageIds = (data.images || []).map((id) => Number(id));

      const newPost = await addPost({
        ...data,
        imageIds: safeImageIds,
        boardId: targetBoardId,
      });

      // 성공 시 이동
      if (newPost?.id) {
        navigate(`/community/board/${newPost.id}`);
      } else {
        navigate("/community/board");
      }
    } catch (error) {
      alert("게시글 작성에 실패했습니다.");
      console.error(error);
    }
  };

  if (!targetBoardId && !boardMap) {
     return <div>로딩 중...</div>;
  }

  return (
    <PostForm
      onSubmit={handleSubmit}
      onCancel={() => navigate("/community/board")}
    />
  );
}