// src/pages/News/NoticeDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    noticePosts,
    increaseNoticeViews,
    noticeComments,
    addNoticeComment,
  } = useBoard();

  const postId = Number(id);
  const post = noticePosts.find((p) => p.id === postId);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const comments = noticeComments[postId] || [];

  const fromUpdatesTop = location.state?.from === "updates-top";

  useEffect(() => {
    if (post) increaseNoticeViews(post.id);
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() =>
            navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
          }
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
    addNoticeComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 교회 소식 > 공지사항"
        title={post.title}
        date={post.date}
        content={post.content}
        file={post.file}
        onBack={() =>
          navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
        }
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

export default NoticeDetailPage;
