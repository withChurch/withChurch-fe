import React from "react";
import { Paperclip } from "lucide-react";
import "./PostDetail.css"; // 공통 스타일

const PostDetail = ({
  breadcrumb,   // 경로
  title,        // 제목
  date,         // 날짜
  content,      // 본문
  file,         // 첨부파일
  comments = [], // 댓글 배열
  onBack,        // 목록 버튼
}) => {
  return (
    <div className="detail-page">

      <div className="detail-breadcrumb">
        <span>{breadcrumb}</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{title}</div>
        <div className="title-date">{date}</div>
      </div>

      <div className="detail-divider"></div>

      <pre className="detail-content">{content}</pre>

      {file && (
        <div className="detail-file-table">
          <div className="file-label-cell">첨부파일</div>
          <div className="file-value-cell">
            <Paperclip size={18} className="file-icon" />
            <span className="file-name">{file}</span>
          </div>
        </div>
      )}

      <div className="detail-button-wrap">
        <button className="back-btn" onClick={onBack}>
          목록
        </button>
      </div>

      <div className="comment-title">댓글</div>

      <div className="comment-list">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.date}</span>
            </div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PostDetail;
