// src/pages/News/UpdateDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Community/BoardDetailPage.css";
import { Paperclip } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

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

  const comments = updateComments[postId] || [];

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (post) increaseUpdateViews(post.id);
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/news/updates")}
        >
          목록
        </button>
      </div>
    );
  }

  // 댓글 등록
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
      <div className="detail-breadcrumb">
        <span>◦ 교회 소식 &gt; 교회소식</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{post.title}</div>
        <div className="title-date">{post.date}</div>
      </div>

      <div className="detail-divider" />
      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          <Paperclip size={18} className="file-icon" />
          <span className="file-name">{post.file}</span>
        </div>
      </div>

      <div className="detail-button-wrap">
        <button
          className="back-btn"
          onClick={() => navigate("/news/updates")}
        >
          목록
        </button>
      </div>

      {/* 댓글 헤더 */}
      <CommentHeader onWrite={() => setIsWriting(true)} />

      {/* 댓글 쓰기 박스 */}
      {isWriting && (
        <CommentWriteBox
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setIsWriting(false)}
        />
      )}

      {/* 댓글 리스트 */}
      <CommentList comments={comments} />
    </div>
  );
};

export default UpdateDetailPage;
