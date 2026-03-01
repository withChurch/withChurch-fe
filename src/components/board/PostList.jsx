// src/components/board/PostList.jsx
import React from "react";
import PostItem from "./PostItem";

export default function PostList({
  noticePosts = [],
  posts = [],
  onItemClick,
  showAuthor = true,
  emptyText = "게시글이 없습니다.",
}) {
  const isEmpty = (noticePosts?.length ?? 0) === 0 && (posts?.length ?? 0) === 0;
  
  const isMobile = useMediaQuery("(max-width: 768px)");

  const colSpan = isMobile ? 3 : (showAuthor ? 5 : 4);
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
        {noticePosts.map((p) => (
          <PostItem
            key={`n-${p.id}`}
            post={p}
            isNotice={true}
            number={p.number}
            onClick={onItemClick}
            showAuthor={showAuthor}
          />
        ))}

        {posts.map((p, index) => (
          <PostItem
            key={p.id}
            post={p}
            isNotice={false}
            number={p.number ?? index + 1}
            onClick={onItemClick}
            showAuthor={showAuthor}
          />
        ))}
        {isEmpty && (
          <tr>
            <td
              colSpan={colSpan}
              style={{
                padding: "30px 0",
                textAlign: "center",
                color: "#999",
                fontSize: "14px",
              }}
            >
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}