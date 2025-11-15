// src/pages/Community/BoardDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetailPage.css";
import { Paperclip } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, increaseViews, comments, addComment } = useBoard();

  const postId = Number(id);
  const post = posts.find((p) => p.id === postId);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = comments[postId] || [];

  useEffect(() => {
    if (post) increaseViews(post.id);
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/community/board")}
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
    addComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      {/* 경로 */}
      <div className="detail-breadcrumb">
        <span>◦ 소통과 공감 &gt; 자유게시판</span>
      </div>

      {/* 제목 */}
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
          onClick={() => navigate("/community/board")}
        >
          목록
        </button>
      </div>

      {/* 댓글 헤더 */}
      <CommentHeader onWrite={() => setIsWriting(true)} />

      {/* 댓글 작성 UI */}
      {isWriting && (
        <CommentWriteBox
          commentText={commentText}
          setCommentText={setCommentText}
          onSubmit={handleSubmitComment}
          onCancel={() => setIsWriting(false)}
        />
      )}

      {/* 댓글 리스트 */}
      <CommentList comments={existingComments} />
    </div>
  );
};

export default BoardDetailPage;
