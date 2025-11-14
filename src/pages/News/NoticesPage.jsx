// src/pages/News/NoticesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import { Home, Search } from "lucide-react";

export default function NoticesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const noticePosts = [
    { id: 10, title: "2025 성탄예배 안내", date: "2025-12-20", views: 302 },
    { id: 9, title: "교회 차량 운행 변경 안내", date: "2025-12-10", views: 214 },
    { id: 8, title: "겨울 수련회 일정 공지", date: "2025-12-02", views: 189 },
    { id: 7, title: "홈페이지 전면 개편 안내", date: "2025-11-20", views: 421 },
  ];

  const handleClick = (id) => navigate(`/news/notices/${id}`);

  return (
    <div className="board-wrapper">
      <div className="board-page">

        <div className="board-breadcrumb">
          <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
          <span>&gt; 교회 소식 &gt; 공지사항</span>
        </div>

        <h1 className="board-title">공지사항</h1>


        <div
          className="board-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* 검색영역 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>

            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "250px",
                fontSize: "14px",
              }}
            />

            <button
              onClick={() => console.log("검색:", searchType, keyword)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "7px 10px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <Search size={18} />
            </button>
          </div>

          {/* 글쓰기 버튼 */}
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
    </div>
  );
}
