// src/pages/News/NoticesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import { Home, Search } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

export default function NoticesPage() {
  const navigate = useNavigate();
  const { noticePosts } = useBoard();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const filtered = noticePosts.filter((p) => {
    if (!keyword.trim()) return true;
    const lower = keyword.toLowerCase();
    if (searchType === "title") {
      return p.title.toLowerCase().includes(lower);
    }
    if (searchType === "content") {
      return (p.content || "").toLowerCase().includes(lower);
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.id - a.id);

  const perPage = 6;
  const totalPages = sorted.length === 0 ? 1 : Math.ceil(sorted.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentPosts = sorted.slice(startIndex, startIndex + perPage);

  const numberedPosts = currentPosts.map((post, idx) => ({
    ...post,
    number: sorted.length - (startIndex + idx),
  }));

  const handleClick = (id) => {
    navigate(`/news/notices/${id}`);
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
  };

  return (
    <div className="board-wrapper">
      <div className="board-page">
        <div className="board-breadcrumb">
          <Home
            size={18}
            style={{ verticalAlign: "middle", marginRight: 6 }}
          />
          <span>&gt; 교회 소식 &gt; 공지사항</span>
        </div>

        <h1 className="board-title">공지사항</h1>

        <div
          className="board-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "13.5px",

                backgroundPositionX: "calc(100% - 9px)", 

              }}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>

            <div style={{ position: "relative", width: "250px" }}>
            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "8.5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                width: "250px",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              style={{
                position: "absolute",
                right: "5px",
                top: "57%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <Search size={18} color="#777" />
            </button>
          </div>
          </div>

          <button
            className="board-write-btn"
            onClick={() => navigate("/news/notices/write")}
          >
            글쓰기 ✎
          </button>
        </div>

        {/* 목록 */}
        <PostList posts={numberedPosts} onItemClick={handleClick}   showAuthor={false}/>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
