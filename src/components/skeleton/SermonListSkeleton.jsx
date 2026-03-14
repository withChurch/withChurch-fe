import React from "react";
import "../sermons/SermonList.css";
import "./SermonListSkeleton.css";

export default function SermonListSkeleton({
  cards = 6,
  showUploadButton = false,
}) {
  return (
    <div className="sermon-list-wrapper sermon-skeleton" aria-busy="true">
      <div className="search-upload-wrapper">
        <div className="search-box">
          <div className="skel sermon-skel-input" />
          <div className="skel sermon-skel-search-icon" />
        </div>

        {showUploadButton && <div className="skel sermon-skel-upload" />}
      </div>

      <div className="sermon-card-grid">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="sermon-card sermon-skel-card">
            <div className="sermon-card-thumb">
              <div className="skel sermon-skel-thumb" />
            </div>

            <div className="sermon-card-content">
              <div className="skel sermon-skel-title" />
              <div className="skel sermon-skel-title sermon-skel-title2" />
              <div className="skel sermon-skel-tag" />
            </div>
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