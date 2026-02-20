import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";

export default function NoticeWritePage() {
  const navigate = useNavigate();
  
  const { addNoticePost, boardMap } = useBoard();

  const targetBoardId = boardMap ? boardMap["공지사항"] : null;

  const handleSubmit = async (data) => {
    if (!targetBoardId) {
      alert("게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const safeImageIds = (data.images || []).map((id) => Number(id));

      const newPost = await addNoticePost({
        ...data, 
        images: safeImageIds,
        boardId: targetBoardId 
      }); 
      
      // 5. 성공 시 상세페이지 이동
      if (newPost?.id) {
        navigate(`/news/notices/${newPost.id}`);
      } else {
        navigate("/news/notices");
      }
    } catch (error) {
      alert("공지사항 작성에 실패했습니다.");
      console.error(error);
    }
  };  

  if (!targetBoardId && !boardMap) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
    <Header
      breadcrumb="◦ 공지사항 > 글쓰기" 
      title="공지사항 작성"
    />
    <PostForm
      showHeader={false}
      onSubmit={handleSubmit} 
      onCancel={() => navigate("/news/notices")}
    />
    </>
  );
}