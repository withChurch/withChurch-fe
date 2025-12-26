// src/pages/Community/BoardDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";
import { useAuth } from "../../contexts/AuthContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const {
    currentPost,
    fetchPostById,
    comments,
    addComment,
    setComments,
    increaseViews,
  } = useBoard();

  const { user } = useAuth();

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = comments[postId] || [];

  const viewedRef = useRef(null);

  useEffect(() => {
    fetchPostById(postId);
  }, [postId, fetchPostById]);

  useEffect(() => {
    if (!postId) return;
    if (viewedRef.current === postId) return;

    viewedRef.current = postId;
    increaseViews(postId);
  }, [postId, increaseViews]);

  if (!currentPost) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">로딩 중...</div>
        </div>
      </div>
    );
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 자유게시판"
        title={currentPost.title}
        author={currentPost.writerName}
        date={currentPost.createdAt}
        content={currentPost.content}
        files={currentPost.files}
        onBack={() => navigate("/community/board")}
        onEdit={
          user && user.id === currentPost.writerId
            ? () => navigate(`/community/board/edit/${postId}`)
            : null
        }
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
          const updated = existingComments.map((c) =>
            c.id === commentId ? { ...c, content: newText } : c
          );
          setComments((prev) => ({
            ...prev,
            [postId]: updated,
          }));
        }}
        onDelete={(commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          const filtered = existingComments.filter(
            (c) => c.id !== commentId
          );
          setComments((prev) => ({
            ...prev,
            [postId]: filtered,
          }));
        }}
      />
    </div>
  );
};

export default BoardDetailPage;
