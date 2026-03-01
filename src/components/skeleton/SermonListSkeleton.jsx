import React from "react";
import "./SermonListSkeleton.css";

export default function SermonListSkeleton({ cards = 6, showUploadButton = false }) {
  return (
    <div className="sermon-list-wrapper sermon-skeleton" aria-busy="true">
      {/* 검색 + 업로드 영역 */}
      <div className="search-upload-wrapper">
        <div className="search-box">
          <div className="skel sermon-skel-input" />
          <div className="skel sermon-skel-search-icon" />
        </div>

        {showUploadButton && <div className="skel sermon-skel-upload" />}
      </div>

      {/* 카드 그리드 */}
      <div className="sermon-card-grid">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="sermon-card sermon-skel-card">
            <div className="skel sermon-skel-title" />
            <div className="skel sermon-skel-title sermon-skel-title2" />
            <div className="skel sermon-skel-tag" />
          </div>
        ))}
      </div>

      <div className="pagination-wrap">
        <div className="sermon-skel-pagination">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skel sermon-skel-page" />
          ))}
        </div>
      </div>
    </div>
  );
}