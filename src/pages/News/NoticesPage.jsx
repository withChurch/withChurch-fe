// src/pages/News/NoticesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import { Home } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";

import { useAuth } from "../../contexts/AuthContext";

export default function NoticesPage() {
  const navigate = useNavigate();
  const { noticePosts } = useBoard();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const { user } = useAuth();
  console.log("user:", user);
  console.log("role:", user?.role);

  const filtered = noticePosts.filter((p) => {
    if (!keyword.trim()) return true;
    const lower = keyword.toLowerCase();

    const target =
      searchType === "title"
        ? p.title
        : (p.content || "");

    return target.toLowerCase().includes(lower);
  });

  const sorted = [...filtered].sort((a, b) => b.id - a.id);

  const perPage = 10;
  const totalPages =
    sorted.length === 0 ? 1 : Math.ceil(sorted.length / perPage);

  const startIndex = (currentPage - 1) * perPage;
  const currentPosts = sorted.slice(startIndex, startIndex + perPage);

  const numberedPosts = currentPosts.map((post, idx) => ({
    ...post,
    number: sorted.length - (startIndex + idx),
  }));

  const handleClick = (id) => {
    navigate(`/news/notices/${id}`);
  };

  return (
    <div className="board-wrapper">
      <div className="board-page">
        <div className="board-breadcrumb">
          <Home
            size={15}
            style={{
              verticalAlign: "middle",
              marginRight: 6,
              marginBottom: 2,
            }}
          />
          <span>&gt; 교회소식 &gt; 공지사항</span>
        </div>

        <h1 className="board-title">공지사항</h1>

        <div
          className="board-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 0,
          }}
        >
          <SearchBar
            searchType={searchType}
            setSearchType={setSearchType}
            keyword={keyword}
            setKeyword={setKeyword}
            setCurrentPage={setCurrentPage}
          />

          {user?.role === "ADMIN" && (
            <button
              className="board-write-btn"
              onClick={() => navigate("/news/notices/write")}
            >
              글쓰기 ✎
            </button>
          )}
        </div>

        <PostList
          posts={numberedPosts}
          onItemClick={handleClick}
          showAuthor={false} // 공지에서는 작성자 숨김
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
