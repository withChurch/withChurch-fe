import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import PostListSkeleton from "../../components/skeleton/PostListSkeleton";

export default function BoardListPage() {
  const navigate = useNavigate();
  const {
    posts,
    postsLoading,
    postsTotalPages,
    postsTotalElements,
    boardMap,
    loadPosts,
  } = useBoard();
  const { user } = useAuth();

  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const boardId = boardMap?.["자유게시판"];

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && postsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = postsLoading;
  }, [postsLoading]);

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedKeyword(keyword.trim());
  };

  useEffect(() => {
    if (!boardId) return;

    loadPosts(currentPage - 1, {
      size: PAGE_SIZE,
      sort: "createdAt,desc",
      keyword: appliedKeyword,
    });
  }, [currentPage, boardId, appliedKeyword]);

  const numberedPosts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total = typeof postsTotalElements === "number" ? postsTotalElements : 0;

    return (posts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;
      return { ...post, number };
    });
  }, [posts, currentPage, postsTotalElements]);

  const handleClick = (id) => {
    navigate(`/community/board/${id}`);
  };

  const showLoadingUI = !boardId || postsLoading || !hasFetchedOnce;

  return (
    <div className="board-wrapper">
      <Header breadcrumb="> 소통과 공감 > 자유게시판" title="자유게시판" />

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
            keyword={keyword}
            setKeyword={setKeyword}
            onSubmit={handleSearch}
          />

          {user && (
            <button
              className="board-write-btn"
              onClick={() => navigate("/community/board/write")}
            >
              글쓰기 ✎
            </button>
          )}
        </div>

        {showLoadingUI ? (
          <PostListSkeleton rows={10} showAuthor={true} />
        ) : (
          <>
            <PostList posts={numberedPosts} onItemClick={handleClick} />

            <div style={{ minHeight: 64 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={postsTotalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}