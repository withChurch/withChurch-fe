// src/pages/Community/PrayerListPage.jsx
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

  // Context에서 getPostsByBoard(boardId, page, 10) 쓰고 있으니 10으로 맞춤
  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const boardId = boardMap?.["중보기도"];
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && prayerPostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = prayerPostsLoading;
  }, [prayerPostsLoading]);

  // 데이터 로드
  useEffect(() => {
    if (!boardId) return;
    loadPrayerPosts(currentPage - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, boardId]);

  const numberedPosts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total =
      typeof prayerPostsTotalElements === "number" ? prayerPostsTotalElements : 0;

    return (prayerPosts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;

      return { ...post, number };
    });
  }, [prayerPosts, currentPage, PAGE_SIZE, prayerPostsTotalElements]);

  // 검색(현재 페이지 내에서 필터링)
  const filteredPosts = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return numberedPosts;

    const lower = kw.toLowerCase();
    return numberedPosts.filter((post) => {
      const target =
        searchType === "title" ? post?.title : post?.content || "";
      return String(target).toLowerCase().includes(lower);
    });
  }, [numberedPosts, keyword, searchType]);

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
            searchType={searchType}
            setSearchType={setSearchType}
            keyword={keyword}
            setKeyword={setKeyword}
            setCurrentPage={setCurrentPage}
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
            <PostList posts={filteredPosts} onItemClick={handleClick} />

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