// src/components/board/CommentList.jsx
import React from "react";

export default function CommentList({ comments = [] }) {
  return (
    <div className="comment-list-box">
      {comments.length === 0 ? (
        <div className="no-comment">등록된 댓글이 없습니다.</div>
      ) : (
        comments.map((c, idx) => (
          <div key={idx} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.date}</span>
            </div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))
      )}
    </div>
  );
}
