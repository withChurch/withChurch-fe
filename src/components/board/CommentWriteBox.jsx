// src/components/board/CommentWriteBox.jsx
import React from "react";

export default function CommentWriteBox({
  text,
  setText,
  onSubmit,
  onCancel,
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="comment-write-box">
      <div className="comment-write-info">
        <span className="cw-author">익명</span>
        <span className="cw-date">{today}</span>
      </div>

      <textarea
        className="comment-textarea"
        placeholder="내용을 입력하세요."
        value={text}                            
        onChange={(e) => setText(e.target.value)}  
      />

      <div className="comment-write-btn-row">
        <button className="cw-submit" onClick={onSubmit}>
          등록
        </button>
        <button className="cw-cancel" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
}
