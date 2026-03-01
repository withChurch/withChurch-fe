// src/components/skeleton/PostListSkeleton.jsx
import React from "react";
import "./PostListSkeleton.css";

export default function PostListSkeleton({ rows = 10, showAuthor = true }) {
  return (
    <div className="postlist-skeleton" aria-busy="true">
      <table className="board-table postlist-skeleton-table">
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
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="postlist-skeleton-row">
              <td className="col-no">
                <span className="post-sk post-sk-no" />
              </td>

              <td className="col-title">
                <span className="post-sk post-sk-title" />
              </td>

              {showAuthor && (
                <td className="col-author">
                  <span className="post-sk post-sk-author" />
                </td>
              )}

              <td className="col-date">
                <span className="post-sk post-sk-date" />
              </td>

              <td className="col-views">
                <span className="post-sk post-sk-views" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination 자리 */}
      <div className="postlist-skeleton-pagination" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="post-sk post-sk-page" />
        ))}
      </div>
    </div>
  );
}