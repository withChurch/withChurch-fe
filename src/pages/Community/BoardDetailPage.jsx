import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetailPage.css";
import { Paperclip } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, increaseViews } = useBoard();

  const postId = Number(id);
  const post = posts.find((p) => p.id === postId);

  useEffect(() => {
    if (post) {
      increaseViews(post.id);
    }
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button className="back-btn" onClick={() => navigate("/community/board")}>
          목록
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <span>◦ 소통과 공감 &gt; 자유게시판</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{post.title}</div>
        <div className="title-date">{post.date}</div>
      </div>

      <div className="detail-divider" />

      <pre className="detail-content">{post.content}</pre>

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
    </div>
  );
};

export default BoardDetailPage;
