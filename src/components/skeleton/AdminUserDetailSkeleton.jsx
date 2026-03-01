import React from "react";

export default function AdminUserDetailSkeleton() {
  const Row = () => (
    <div className="detail-row skel-detail-row" aria-hidden="true">
      <div className="detail-label-group">
        <span className="skeleton skel-detail-icon" />
        <span className="skeleton skel-detail-label" />
      </div>
      <div className="skeleton skel-detail-value" />
    </div>
  );

  return (
    <div className="white-card detail-card" aria-busy="true">
      {/* 상단 헤더 */}
      <div className="detail-header">
        <div className="detail-avatar skeleton skeleton-circle skel-detail-avatar" />
        <div className="skeleton skel-detail-name" />
        <div className="skeleton skel-detail-badge" />
      </div>

      <hr className="divider" />

      {/* 정보 리스트 */}
      <div className="detail-info-list">
        <div className="skeleton skel-detail-section" />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />

        <div style={{ marginTop: 30 }} />

        <div className="skeleton skel-detail-section" />
        <Row />
        <Row />
        <Row />
      </div>

      {/* 하단 버튼 */}
      <div className="detail-actions">
        <div className="skeleton skel-detail-btn" />
        <div className="detail-actions-right">
          <div className="skeleton skel-detail-btn" />
        </div>
      </div>
    </div>
  );
}