// src/components/board/PostList.jsx
import React from "react";
import PostItem from "./PostItem";

export default function PostList({ noticePosts = [], posts = [], onItemClick }) {
  return (
    <table className="board-table">
      <thead>
        <tr>
          <th className="col-no">번호</th>
          <th className="col-title">제목</th>
          <th className="col-date">등록일</th>
          <th className="col-views">조회수</th>
        </tr>
      </thead>

      <tbody>
        {noticePosts.map((p) => (
          <PostItem key={`n-${p.id}`} post={p} onClick={onItemClick} isNotice />
        ))}

        {posts.map((p) => (
          <PostItem key={p.id} post={p} onClick={onItemClick} isNotice={false} />
        ))}
      </tbody>
    </table>
  );
}
