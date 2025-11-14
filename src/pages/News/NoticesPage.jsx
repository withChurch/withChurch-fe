// src/pages/News/NoticesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import { Home } from "lucide-react";

export default function NoticesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const noticePosts = [
    { id: 10, title: "2025 성탄예배 안내", date: "2025-12-20", views: 302 },
    { id: 9, title: "교회 차량 운행 변경 안내", date: "2025-12-10", views: 214 },
    { id: 8, title: "겨울 수련회 일정 공지", date: "2025-12-02", views: 189 },
    { id: 7, title: "홈페이지 전면 개편 안내", date: "2025-11-20", views: 421 },
  ];

  const handleClick = (id) => navigate(`/news/notices/${id}`);

  return (
    <div className="board-page">

      <div className="board-breadcrumb">
        <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
        <span>&gt; 교회 소식 &gt; 공지사항</span>
      </div>

      <h1 className="board-title">공지사항</h1>

      <div className="board-actions">
        <button
          className="board-write-btn"
          onClick={() => navigate("/news/notices/write")}
        >
          글쓰기 ✎
        </button>
      </div>

      <PostList posts={noticePosts} onItemClick={handleClick} />

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

