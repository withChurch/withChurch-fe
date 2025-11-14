// src/pages/Community/PrayerListPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import { Home } from "lucide-react";

export default function PrayerListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const posts = [
    { id: 5, title: "기도 부탁드립니다", date: "2025-11-10", views: 103 },
    { id: 4, title: "가족이 병상입니다. 기도 부탁드립니다", date: "2025-11-08", views: 152 },
    { id: 3, title: "다음 주 중요한 시험을 앞두고 있습니다", date: "2025-11-02", views: 88 },
    { id: 2, title: "신앙 회복을 위해", date: "2025-10-25", views: 132 },
    { id: 1, title: "직장에서의 어려움, 기도 부탁드립니다", date: "2025-10-19", views: 201 },
  ];

  const handleClick = (id) => navigate(`/community/prayer/${id}`);

  return (
    <div className="board-wrapper">
      <div className="board-page">

        <div className="board-breadcrumb">
          <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
          <span>&gt; 소통과 공감 &gt; 중보기도</span>
        </div>

        <h1 className="board-title">중보기도</h1>

        <div className="board-actions">
          <button
            className="board-write-btn"
            onClick={() => navigate("/community/prayer/write")}
          >
            글쓰기 ✎
          </button>
        </div>

        <PostList posts={posts} onItemClick={handleClick} />

        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
