// src/pages/News/NoticesPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/board/PostList";
import Pagination from "../../components/board/Pagination";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import PostListSkeleton from "../../components/skeleton/PostListSkeleton";

export default function NoticesPage() {
  const navigate = useNavigate();

  const {
    noticePosts,
    noticePostsLoading,
    noticePostsTotalPages,
    noticePostsTotalElements,
    boardMap,
    loadNoticePosts,
  } = useBoard();

  const { user } = useAuth();

  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const boardId = boardMap?.["공지사항"];

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && noticePostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = noticePostsLoading;
  }, [noticePostsLoading]);

  useEffect(() => {
    if (!boardId) return;
    loadNoticePosts(currentPage - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, boardId]);

  const numberedPosts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total = typeof noticePostsTotalElements === "number" ? noticePostsTotalElements : 0;

    return (noticePosts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;
      return { ...post, number };
    });
  }, [noticePosts, currentPage, PAGE_SIZE, noticePostsTotalElements]);

  const filteredPosts = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return numberedPosts;

    const lower = kw.toLowerCase();
    return numberedPosts.filter((p) => {
      const target = searchType === "title" ? p?.title : p?.content || "";
      return String(target).toLowerCase().includes(lower);
    });
  }, [numberedPosts, keyword, searchType]);

  const handleClick = (id) => {
    navigate(`/news/notices/${id}`);
  };

  const showLoadingUI = !boardId || noticePostsLoading || !hasFetchedOnce;

  const isSearching = keyword.trim().length > 0;
  const emptyText = isSearching ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다.";

  return (
    <div className="board-wrapper">
      <Header breadcrumb="> 교회소식 > 공지사항" title="공지사항" />

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

          {user?.role === "ADMIN" && (
            <button className="board-write-btn" onClick={() => navigate("/news/notices/write")}>
              글쓰기 ✎
            </button>
          )}
        </div>

        {showLoadingUI ? (
          <PostListSkeleton rows={10} showAuthor={false} />
        ) : (
          <>
            <PostList
              posts={filteredPosts}
              onItemClick={handleClick}
              showAuthor={false}
              emptyText={emptyText} 
            />

            <div style={{ minHeight: 64 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={noticePostsTotalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}