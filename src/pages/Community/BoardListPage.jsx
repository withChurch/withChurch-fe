import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";

export default function BoardListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const posts = [
    { id: 6, title: "교회 셔틀버스 운영안내", date: "2025-11-08", views: 67 },
    { id: 5, title: "With Church 유튜브 (You Tube) 구독 방법", date: "2025-11-02", views: 101 },
    { id: 4, title: "학습 / 세례 / 입교식 예고", date: "2025-11-01", views: 128 },
    { id: 3, title: "추수감사절 예배안내", date: "2025-10-26", views: 145 },
    { id: 2, title: "2025년 10월 26일 연합예배안내", date: "2025-10-25", views: 210 },
    { id: 1, title: "유아세례식 예고", date: "2025-10-19", views: 223 },
  ];

  const handleClick = (id) => {
    navigate(`/community/board/${id}`);
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
  };

  return (
    <div className="board-page">
      <div className="board-breadcrumb">
        <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
        <span>&gt; 소통과 공감 &gt; 자유게시판</span>
      </div>

      <h1 className="board-title">자유게시판</h1>

      <div className="board-actions">
        <button
          className="board-write-btn"
          onClick={() => navigate("/community/board/write")}
        >
          글쓰기 ✎
        </button>
      </div>

      <PostList posts={posts} onItemClick={handleClick} />

      <Pagination
        currentPage={currentPage}
        totalPages={4}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
