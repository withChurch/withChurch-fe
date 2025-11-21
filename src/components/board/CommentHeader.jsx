// src/components/board/CommentHeader.jsx
import React from "react";

export default function CommentHeader({ onWrite }) {
  return (
    <div className="comment-header-row">
      <div className="comment-header-title">댓글</div>
      <button className="comment-write-toggle" onClick={onWrite}>
        댓글쓰기 ✎
      </button>
    </div>
  );
}
