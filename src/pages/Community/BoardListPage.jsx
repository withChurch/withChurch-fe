import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";

export default function BoardListPage() {
  const navigate = useNavigate();
  const { posts, postsLoading, postsTotalPages, boardMap, loadPosts } = useBoard();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (boardMap["자유게시판"]) {
      loadPosts(currentPage - 1);
    }
  }, [currentPage, boardMap["자유게시판"]]);

  const filteredPosts = posts.filter((post) => {
    if (!keyword.trim()) return true;
    const target =
      searchType === "title"
        ? post.title
        : post.content || "";
    return target.toLowerCase().includes(keyword.toLowerCase());
  });

  const numberedPosts = filteredPosts.map((post, idx) => ({
    ...post,
    number: filteredPosts.length - idx,
  }));

  const handleClick = (id) => {
    navigate(`/community/board/${id}`);
  };

  return (
    <div className="board-wrapper">
      <div className="board-page">
        <div className="board-breadcrumb">
          <Home size={15} style={{ verticalAlign: "middle", marginRight: 6, marginBottom:2}} />
          <span>&gt; 소통과 공감 &gt; 자유게시판</span>
        </div>

        <h1 className="board-title">자유게시판</h1>

          
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
              onClick={() => navigate("/community/board/write")}
            >
              글쓰기 ✎
            </button>
          )}
        </div>

        {postsLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>로딩 중...</div>
        ) : (
          <>
            <PostList posts={numberedPosts} onItemClick={handleClick} />

            <Pagination
              currentPage={currentPage}
              totalPages={postsTotalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
