import React from "react";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../../contexts/BoardContext";

export default function PrayerWritePage() {
  const navigate = useNavigate();
  
  const { addPrayerPost, boardMap } = useBoard();

  const targetBoardId = boardMap ? boardMap["중보기도"] : null;

  const handleSubmit = async (data) => {
    if (!targetBoardId) {
      alert("게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const safeImageIds = (data.images || []).map((id) => Number(id));

      const newPost = await addPrayerPost({
        ...data,
        images: safeImageIds, 
        boardId: targetBoardId,
      });

      if (newPost?.id) {
        navigate(`/community/prayer/${newPost.id}`);
      } else {
        navigate("/community/prayer");
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
    <>
    <Header
      breadcrumb="◦ 중보기도 > 글쓰기"
      title="중보기도 작성"
    />
    <PostForm
      showHeader={false}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/community/prayer")}
    />
    </>
  );
}