// src/components/board/PostItem.jsx
import React from "react";

export default function PostItem({ post, onClick, isNotice, number, showAuthor }) {
  return (
    <tr
      onClick={() => onClick(post.id)}
      className={isNotice ? "notice-row" : ""}
      style={{ cursor: "pointer" }}
    >
      <td className="col-no">
        {isNotice ? "공지" : number}
      </td>

      <td className="col-title">
        {isNotice && <span className="notice-badge">공지</span>}
        {post.title}
      </td>

      {showAuthor && (
        <td className="col-author">{post.author || "TAB"}</td>
      )}

      <td className="col-date">{post.date}</td>
      <td className="col-views">{post.views}</td>
    </tr>
  );
}
