import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/board/Pagination";
import PostList from "../../components/board/PostList";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import PostListSkeleton from "../../components/skeleton/PostListSkeleton";

export default function PrayerListPage() {
  const navigate = useNavigate();

  const {
    prayerPosts,
    prayerPostsLoading,
    prayerPostsTotalPages,
    prayerPostsTotalElements,
    boardMap,
    loadPrayerPosts,
  } = useBoard();

  const { user } = useAuth();

  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const boardId = boardMap?.["중보기도"];

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && prayerPostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = prayerPostsLoading;
  }, [prayerPostsLoading]);

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedKeyword(keyword.trim());
  };

  useEffect(() => {
    if (!boardId) return;

    loadPrayerPosts(currentPage - 1, {
      size: PAGE_SIZE,
      sort: "createdAt,desc",
      keyword: appliedKeyword,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, boardId, appliedKeyword]);

  const numberedPosts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total =
      typeof prayerPostsTotalElements === "number" ? prayerPostsTotalElements : 0;

    return (prayerPosts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;
      return { ...post, number };
    });
  }, [prayerPosts, currentPage, PAGE_SIZE, prayerPostsTotalElements]);

  const handleClick = (id) => {
    navigate(`/community/prayer/${id}`);
  };

  const showLoadingUI = !boardId || prayerPostsLoading || !hasFetchedOnce;

  return (
    <div className="board-wrapper">
      <Header breadcrumb="> 소통과 공감 > 중보기도" title="중보기도" />

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
              onClick={() => navigate("/community/prayer/write")}
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
                totalPages={prayerPostsTotalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}