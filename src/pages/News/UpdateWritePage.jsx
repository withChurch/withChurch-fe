import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";

export default function UpdateWritePage() {
  const navigate = useNavigate();
  
  const { addUpdatePost, boardMap } = useBoard();

  const targetBoardId = boardMap ? boardMap["교회소식"] : null;

  const handleSubmit = async (data) => {
    if (!targetBoardId) {
      alert("게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const safeImageIds = (data.images || []).map((id) => Number(id));

      const newPost = await addUpdatePost({ 
        ...data,
        images: safeImageIds, 
        boardId: targetBoardId 
      }); 
      
      if (newPost?.id) {
        navigate(`/news/updates/${newPost.id}`);
      } else {
        navigate("/news/updates");
      }
    } catch (error) {
      alert("교회소식 작성에 실패했습니다.");
      console.error(error);
    }
  };  

  if (!targetBoardId && !boardMap) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
    <Header
      breadcrumb="◦ 교회소식 > 글쓰기" 
      title="교회소식 작성"
    />
    <PostForm
      showHeader={false}
      onSubmit={handleSubmit} 
      onCancel={() => navigate("/news/updates")}
    />
    </>
  );
}