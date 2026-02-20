import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";

export default function SundaySermonWritePage() {
  const navigate = useNavigate();
  
  const { addSundayPost, boardMap } = useBoard();

  const targetBoardId = boardMap ? boardMap["주일예배"] : null;

  const handleSubmit = async (data) => {
    if (!targetBoardId) {
      alert("게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const safeImageIds = (data.images || []).map((id) => Number(id));

      const newPost = await addSundayPost({
        ...data, 
        images: safeImageIds, 
        boardId: targetBoardId 
      });

      alert("주일예배 말씀이 등록되었습니다.");


      const newId = newPost?.postId || newPost?.id;

      if (newId) {
        navigate(`/sermon/sunday/${newId}`);
      } else {
        navigate("/sermon/sunday");
      }

    } catch (error) {
      console.error("작성 실패:", error);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  if (!targetBoardId && !boardMap) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
    <Header
      breadcrumb="◦ 주일예배 > 글쓰기" 
      title="주일예배 작성"
    />

    <PostForm
      showHeader={false}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/sermon/sunday")}
    />
    </>
  );
}