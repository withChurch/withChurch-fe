import React from "react";

export default function AdminUserListSkeleton({ rows = 10 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="user-list-item skel-user-item">
          <div className="user-info-group">
            {/* avatar */}
            <div className="user-avatar skeleton skeleton-circle" />

            {/* name/email */}
            <div>
              <div className="skeleton skel-user-name" />
              <div className="skeleton skel-user-email" />
            </div>
          </div>

          <div className="user-meta-group">
            <div className="skeleton skel-join-date" />
            <div className="skeleton skel-chevron" />
          </div>
        </div>
      ))}
    </div>
  );
}