// src/components/board/PostDetail.jsx
import React from "react";
import { Paperclip } from "lucide-react";
import "./PostDetail.css";
import { useNavigate } from "react-router-dom";

export default function PostDetail({
  breadcrumb, 
  title,
  date,
  content,
  file,
  onBack,
  onEdit,
}) {
  return (
    <>
      <div className="detail-breadcrumb">
        <span>{breadcrumb}</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{title}</div>
        <div className="title-date">{date}</div>
      </div>

      <div className="detail-divider" />

      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          <Paperclip size={18} className="file-icon" />
          <span className="file-name">{file}</span>
        </div>
      </div>

      {/* 목록 버튼 */}
      <div className="detail-button-wrap">
        <button className="back-btn" onClick={onBack}>
          목록
        </button>
        <button className="edit-btn" onClick={onEdit}>
          수정
        </button>

      </div>
    </>
  );
}
