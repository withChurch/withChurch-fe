import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";
import { useBoard } from "../../contexts/BoardContext";

export default function BoardListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { posts } = useBoard();

  const perPage = 6;
  const totalPages = Math.ceil(posts.length / perPage);

  const startIndex = (currentPage - 1) * perPage;
  const currentPosts = posts.slice(startIndex, startIndex + perPage);

  const numberedPosts = currentPosts.map((post, idx) => ({
    ...post,
    number: posts.length - (startIndex + idx), 
  }));

  const handleClick = (id) => {
    navigate(`/community/board/${id}`);
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
  };

  return (
    <div className="board-wrapper">
      <div className="board-page">
        <div className="board-breadcrumb">
          <Home size={18} style={{ verticalAlign: "middle", marginRight: 6 }} />
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

        <PostList posts={numberedPosts} onItemClick={handleClick} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
