import React, { useMemo } from "react";
import "../board/PostDetail.css";
import "./PostDetailSkeleton.css";

export default function PostDetailSkeleton({
  breadcrumbWidth = 240,
  contentLines = 6,
  showEditButton = true,

  estimatedTextLength,
  minContentLines = 4,
  maxContentLines = 14,

  showComments = true,
  commentItems = 1,
  commentLines = 2,
}) {
  const computedLines = useMemo(() => {
    if (typeof estimatedTextLength === "number" && estimatedTextLength >= 0) {
      const approx = Math.ceil(estimatedTextLength / 50);
      return Math.max(minContentLines, Math.min(maxContentLines, approx));
    }
    return contentLines;
  }, [estimatedTextLength, contentLines, minContentLines, maxContentLines]);

  const lineWidths = useMemo(() => {
    return Array.from({ length: computedLines }).map((_, i) => {
      if (i === computedLines - 1) return "58%";
      if (i % 3 === 0) return "100%";
      if (i % 3 === 1) return "92%";
      return "78%";
    });
  }, [computedLines]);

  const commentLineWidths = useMemo(() => {
    // 댓글 내용은 보통 1~2줄이 자연스러워서 짧게
    const base = ["76%", "54%", "62%"];
    return Array.from({ length: commentLines }).map((_, i) => base[i % base.length]);
  }, [commentLines]);

  return (
    <div
      className="postdetail-skeleton"
      aria-busy="true"
      role="status"
      aria-label="게시글을 불러오는 중입니다"
    >
      {/* breadcrumb */}
      <div className="detail-breadcrumb">
        <span
          className="pd-sk pd-sk-breadcrumb"
          style={{ width: breadcrumbWidth }}
          aria-hidden="true"
        />
      </div>

      {/* title box */}
      <div className="detail-title-box">
        <div className="title-text pd-sk-title-wrap">
          <span className="pd-sk pd-sk-title" aria-hidden="true" />
        </div>

        <div className="title-meta">
          <span className="pd-sk pd-sk-author" aria-hidden="true" />
          <span className="pd-sk pd-sk-date" aria-hidden="true" />
        </div>
      </div>

      <div className="detail-divider" />

      {/* content */}
      <div className="detail-content">
        <div className="pd-sk-content" aria-hidden="true">
          {lineWidths.map((w, i) => (
            <span key={i} className="pd-sk pd-sk-line" style={{ width: w }} />
          ))}
        </div>
      </div>

      <div className="detail-file-table">
        <div className="file-label-cell">
          <span className="pd-sk pd-sk-file-label" aria-hidden="true" />
        </div>

        <div className="file-value-cell" aria-hidden="true">
          <div className="pd-sk-file-row">
            <span className="pd-sk pd-sk-file-icon" />
            <span className="pd-sk pd-sk-file-name" />
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="detail-button-wrap" aria-hidden="true">
        <span className="pd-sk pd-sk-btn" />
        {showEditButton && <span className="pd-sk pd-sk-btn" />}
      </div>

      {showComments && (
        <>
          <div className="comment-header-row" aria-hidden="true">
            <span className="pd-sk pd-sk-comment-title" />
            <span className="pd-sk pd-sk-comment-write" />
          </div>

          <div className="comment-list-box" aria-hidden="true">
            {Array.from({ length: commentItems }).map((_, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-header">
                  <span className="pd-sk pd-sk-comment-author" />
                  <span className="pd-sk pd-sk-comment-date" />

                  <div className="comment-actions">
                    <span className="pd-sk pd-sk-comment-action" />
                    <span className="pd-sk pd-sk-comment-action" />
                  </div>
                </div>

                <div className="comment-content pd-sk-comment-content">
                  {commentLineWidths.map((w, i) => (
                    <span
                      key={i}
                      className="pd-sk pd-sk-comment-line"
                      style={{ width: w }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}