// src/components/board/PostItem.jsx
import React from "react";

export default function PostItem({ post, onClick, isNotice }) {
  return (
    <tr
      onClick={() => onClick(post.id)}
      className={isNotice ? "notice-row" : ""}
      style={{ cursor: "pointer" }}
    >
      <td className="col-no">{post.id}</td>
      <td className="col-title">
        {isNotice && <span className="notice-badge">공지</span>}
        {post.title}
      </td>
      <td className="col-date">{post.date}</td>
      <td className="col-views">{post.views}</td>
    </tr>
  );
}
