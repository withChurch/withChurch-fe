// src/pages/Community/PrayerListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";

export default function PrayerListPage() {
  const navigate = useNavigate();
  const { prayerPosts, prayerPostsLoading, prayerPostsTotalPages, boardMap, loadPrayerPosts } = useBoard();
  const { user } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (boardMap["중보기도"]) {
      loadPrayerPosts(currentPage - 1);
    }
  }, [currentPage, boardMap["중보기도"]]);

  const filteredPosts = prayerPosts.filter((post) => {
    if (!keyword.trim()) return true;
    const target =
      searchType === "title" ? post.title : post.content || "";
    return target.toLowerCase().includes(keyword.toLowerCase());
  });

  const numberedPosts = filteredPosts.map((post, idx) => ({
    ...post,
    number: filteredPosts.length - idx,
  }));

  const handleClick = (id) => {
    navigate(`/community/prayer/${id}`);
  };

  return (
    <div className="board-wrapper">
      <Header
        breadcrumb="> 소통과 공감 > 중보기도"
        title="중보기도"
      />

      <div className="board-page">
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
        {user &&(
        <button
          className="board-write-btn"
          onClick={() => navigate("/community/prayer/write")}
        >
          글쓰기 ✎
        </button>
        )}
        </div>

        {prayerPostsLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>로딩 중...</div>
        ) : (
          <>
            <PostList posts={numberedPosts} onItemClick={handleClick} />

            <Pagination
              currentPage={currentPage}
              totalPages={prayerPostsTotalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
