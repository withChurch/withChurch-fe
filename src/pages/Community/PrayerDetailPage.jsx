// src/pages/Community/PrayerDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetailPage.css";
import { Paperclip } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

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
  } = useBoard();

  const postId = Number(id);
  const post = prayerPosts.find((p) => p.id === postId);

  const comments = prayerComments[postId] || [];

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

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

  const handleSubmit = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addPrayerComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <span>◦ 소통과 공감 &gt; 중보기도</span>
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
          onClick={() => navigate("/community/prayer")}
        >
          목록
        </button>
      </div>

      {/* 댓글 영역 */}
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

export default PrayerDetailPage;
