// src/pages/Community/PrayerDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const PrayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    prayerPosts,
    increasePrayerViews,
    prayerComments,
    addPrayerComment,
    setPrayerComments,
  } = useBoard();

  const postId = Number(id);
  const post = prayerPosts.find((p) => p.id === postId);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = prayerComments[postId] || [];

  useEffect(() => {
    if (post) increasePrayerViews(post.id);
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/community/prayer")}
        >
          목록
        </button>
      </div>
    );
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addPrayerComment(postId, commentText,"중보기도");
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 중보기도"
        title={post.title}
        date={post.date}
        content={post.content}
        files={post.files || []}        
        onEdit={() => navigate(`/community/prayer/edit/${postId}`)} 
        onBack={() => navigate("/community/prayer")}
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmitComment}
          onCancel={() => setIsWriting(false)}
        />
      )}

      <CommentList
        comments={existingComments}
        onUpdate={(commentId, newText) => {
        const updated = existingComments.map(c =>
          c.id === commentId ? { ...c, content: newText } : c
        );

          setPrayerComments(prev => ({
            ...prev,
            [postId]: updated
          }));
        }}
        onDelete={(commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          const filtered = existingComments.filter(c => c.id !== commentId);

          setPrayerComments(prev => ({
            ...prev,
            [postId]: filtered
          }));
        }}
      />

    </div>
  );
};

export default PrayerDetailPage;
