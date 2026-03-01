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
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const boardId = boardMap?.["자유게시판"];

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && postsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = postsLoading;
  }, [postsLoading]);

  useEffect(() => {
    if (!boardId) return;
    loadPosts(currentPage - 1);
  }, [currentPage, boardId]);

  const numberedPosts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total = typeof postsTotalElements === "number" ? postsTotalElements : 0;

    return (posts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;

      return { ...post, number };
    });
  }, [posts, currentPage, PAGE_SIZE, postsTotalElements]);

  const filteredPosts = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return numberedPosts;

    const lower = kw.toLowerCase();
    return numberedPosts.filter((post) => {
      const target =
        searchType === "title"
          ? post?.title
          : post?.content || "";
      return String(target).toLowerCase().includes(lower);
    });
  }, [numberedPosts, keyword, searchType]);

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
            searchType={searchType}
            setSearchType={setSearchType}
            keyword={keyword}
            setKeyword={setKeyword}
            setCurrentPage={setCurrentPage}
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
            <PostList posts={filteredPosts} onItemClick={handleClick} />

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