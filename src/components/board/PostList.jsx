// src/components/board/PostList.jsx
import React from "react";
import PostItem from "./PostItem";

export default function PostList({ noticePosts = [], posts = [], onItemClick, showAuthor=true }) {
  return (
    <table className="board-table">
      <thead>
        <tr>
          <th className="col-no">번호</th>
          <th className="col-title">제목</th>
          {showAuthor && <th className="col-author">작성자</th>}
          <th className="col-date">등록일</th>
          <th className="col-views">조회수</th>
        </tr>
      </thead>

      <tbody>
        {/* 공지사항 — 작성자 숨김 */}
        {noticePosts.map((p) => (
          <PostItem
            key={`n-${p.id}`}
            post={p}
            isNotice={true}
            number={p.number}
            onClick={onItemClick}
            showAuthor={showAuthor}   // 작성자 숨김
          />
        ))}

        {/* 일반 게시판 — 작성자 표시 */}
        {posts.map((p, index) => (
          <PostItem
            key={p.id}
            post={p}
            isNotice={false}
            number={p.number ?? index + 1}
            onClick={onItemClick}
            showAuthor={showAuthor}    // 작성자 표시
          />
        ))}
      </tbody>
    </table>
  );
}
