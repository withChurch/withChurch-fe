// src/pages/Auth/MyPostsPageSkeleton.jsx
import React from "react";
import "./MyPostsPageSkeleton.css";

export default function MyPostsPageSkeleton({ cards = 6, filters = 6 }) {
  return (
    <div className="myposts-wrapper myposts-skeleton" aria-busy="true">
      {/* 타이틀/서브 타이틀 스켈레톤 */}
      <div className="myposts-skel-header">
        <div className="skel skel-h2" />
        <div className="skel skel-sub" />
      </div>

      {/* 필터 버튼 스켈레톤 */}
      <div className="myposts-skel-filters">
        {Array.from({ length: filters }).map((_, i) => (
          <div key={i} className="skel skel-pill" />
        ))}
      </div>

      {/* 리스트 카드 스켈레톤 */}
      <div className="myposts-list">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="myposts-item myposts-skel-card">
            <div className="skel skel-cat" />
            <div className="skel skel-title-line" />
            <div className="myposts-skel-bottom">
              <div className="skel skel-mini" />
              <div className="skel skel-mini" />
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="myposts-skel-pagination">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skel skel-page" />
        ))}
      </div>
    </div>
  );
}