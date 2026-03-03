import React from "react";
import "../board/PostDetail.css";      // ✅ 기존 상세 레이아웃 재사용
import "./PostDetailSkeleton.css";     // ✅ 스켈레톤 스타일

export default function PostDetailSkeleton({
  showEditButton = false,
  imageCount = 0,     // ✅ 기본 0 (이미지 없는 글이 많아서 레이아웃 점프 줄이기)
  fileCount = 2,
  lines = 10,
}) {
  const widths = [96, 92, 88, 94, 80, 90, 86, 70];

  return (
    <div className="postdetail-skeleton" aria-busy="true">
      {/* breadcrumb */}
      <div className="detail-breadcrumb">
        <div className="skel skel-breadcrumb" />
      </div>

      {/* title box */}
      <div className="detail-title-box">
        <div className="skel skel-title" />
        <div className="title-meta">
          <div className="skel skel-meta" />
          <div className="skel skel-meta skel-meta-lg" />
        </div>
      </div>

      <div className="detail-divider" />

      {/* content */}
      <div className="detail-content">
        {imageCount > 0 && (
          <div className="detail-image-preview">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className="skel skel-preview-img" />
            ))}
          </div>
        )}

        <div className="view-content">
          <div className="skel skel-content-heading" />

          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="skel skel-line"
              style={{ width: `${widths[i % widths.length]}%` }}
            />
          ))}

          <div className="skel skel-line skel-line-last" style={{ width: "52%" }} />
        </div>
      </div>

      {/* files */}
      <div className="detail-file-table">
        <div className="file-label-cell">
          <div className="skel skel-file-label" />
        </div>
        <div className="file-value-cell">
          {Array.from({ length: fileCount }).map((_, i) => (
            <div key={i} className="skel skel-file-item" />
          ))}
        </div>
      </div>

      {/* buttons */}
      <div className="detail-button-wrap">
        <div className="skel skel-btn" />
        {showEditButton && <div className="skel skel-btn skel-btn-edit" />}
      </div>
    </div>
  );
}