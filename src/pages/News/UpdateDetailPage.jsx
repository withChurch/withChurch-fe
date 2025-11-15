// src/pages/News/UpdateDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../components/board/PostDetail.css";
import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const UpdateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    updatePosts,
    increaseUpdateViews,
    updateComments,
    addUpdateComment,
  } = useBoard();

  const postId = Number(id);
  const post = updatePosts.find((p) => p.id === postId);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const comments = updateComments[postId] || [];

  useEffect(() => {
    if (post) increaseUpdateViews(post.id);
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button className="back-btn" onClick={() => navigate("/news/updates")}>
          목록
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addUpdateComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 교회 소식 > 교회소식"
        title={post.title}
        date={post.date}
        content={post.content}
        file={post.file}
        onBack={() => navigate("/news/updates")}
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setIsWriting(false)}
        />
      )}

      <CommentList comments={comments} />
    </div>
  );
};

export default UpdateDetailPage;
