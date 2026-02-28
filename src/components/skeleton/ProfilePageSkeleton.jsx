// ProfilePageSkeleton.jsx
import React from "react";
import "../../pages/Auth/ProfilePage.css";

export default function ProfilePageSkeleton() {
  return (
    <div className="profile-page-wrapper" aria-busy="true">
      <div className="profile-content-container">
        {/* 프로필 카드 스켈레톤 */}
        <div className="white-card">
          <div className="profile-header">
            <div className="profile-image-wrapper skeleton skeleton-circle" />
            <div className="skel-profile-text">
              <div className="skeleton skel-name" />
              <div className="skeleton skel-email" />
              <div className="skeleton skel-badge" />
            </div>
          </div>
        </div>

        {/* 내 정보 */}
        <div className="white-card">
          <div className="skeleton skel-section-title" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="list-item skel-list-item">
              <div className="skeleton skel-item-text" />
              <div className="skeleton skel-item-icon" />
            </div>
          ))}
        </div>

        {/* 내 활동 */}
        <div className="white-card">
          <div className="skeleton skel-section-title" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="list-item skel-list-item">
              <div className="skeleton skel-item-text" />
              <div className="skeleton skel-item-icon" />
            </div>
          ))}
        </div>

        {/* 기타 */}
        <div className="white-card">
          <div className="skeleton skel-section-title" />
          <div className="skeleton skel-delete" />
        </div>
      </div>
    </div>
  );
}