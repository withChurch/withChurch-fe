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
          <PostItem
            key={`n-${p.id}`}
            post={p}
            isNotice={true}
            number={p.number}
            onClick={onItemClick}
          />
        ))}

        {posts.map((p, index) => (
          <PostItem
            key={p.id}
            post={p}
            isNotice={false}
            number={p.number ?? index + 1}
            onClick={onItemClick}
          />
        ))}
      </tbody>
    </table>
  );
}
