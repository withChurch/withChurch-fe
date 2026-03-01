// src/pages/News/UpdatesPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/board/Pagination";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import PostListSkeleton from "../../components/skeleton/PostListSkeleton";

export default function UpdatesPage() {
  const navigate = useNavigate();

  const {
    boardMap,

    noticePosts,
    noticePostsLoading,
    loadNoticePosts,

    updatePosts,
    updatePostsLoading,
    updatePostsTotalPages,
    updatePostsTotalElements,
    loadUpdatePosts,
  } = useBoard();

  const { user } = useAuth();

  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const noticeBoardId = boardMap?.["공지사항"];
  const updateBoardId = boardMap?.["교회소식"];

  const [hasFetchedUpdateOnce, setHasFetchedUpdateOnce] = useState(false);
  const prevUpdateLoadingRef = useRef(false);

  useEffect(() => {
    if (prevUpdateLoadingRef.current === true && updatePostsLoading === false) {
      setHasFetchedUpdateOnce(true);
    }
    prevUpdateLoadingRef.current = updatePostsLoading;
  }, [updatePostsLoading]);

  useEffect(() => {
    if (!noticeBoardId) return;
    loadNoticePosts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noticeBoardId]);

  // 교회소식 페이지 데이터 로드
  useEffect(() => {
    if (!updateBoardId) return;
    loadUpdatePosts(currentPage - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBoardId, currentPage]);

  useEffect(() => {
    if (!updatePostsTotalPages) return;
    if (currentPage > updatePostsTotalPages) {
      setCurrentPage(updatePostsTotalPages);
    }
  }, [currentPage, updatePostsTotalPages]);

  // 상단 공지 2개
  const topNotices = useMemo(() => {
    const list = Array.isArray(noticePosts) ? noticePosts : [];
    const sorted = [...list].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
    return sorted.slice(0, 2);
  }, [noticePosts]);

  const numberedUpdates = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    const total =
      typeof updatePostsTotalElements === "number" ? updatePostsTotalElements : 0;

    return (updatePosts || []).map((post, idx) => {
      const number = total > 0 ? total - (offset + idx) : offset + idx + 1;
      return { ...post, number };
    });
  }, [updatePosts, currentPage, PAGE_SIZE, updatePostsTotalElements]);

  const filteredUpdates = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return numberedUpdates;

    const lower = kw.toLowerCase();
    return numberedUpdates.filter((p) => {
      const target = searchType === "title" ? p?.title : p?.content || "";
      return String(target).toLowerCase().includes(lower);
    });
  }, [numberedUpdates, keyword, searchType]);

  const handleNoticeClick = (id) => {
    navigate(`/news/notices/${id}`, { state: { from: "updates-top" } });
  };

  const handleUpdateClick = (id) => {
    navigate(`/news/updates/${id}`);
  };

  const showLoadingUI = !updateBoardId || updatePostsLoading || !hasFetchedUpdateOnce;

  return (
    <div className="board-wrapper">
      <Header breadcrumb="> 교회소식 > 교회소식" title="교회소식" />

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
            <button
              className="board-write-btn"
              onClick={() => navigate("/news/updates/write")}
            >
              글쓰기 ✎
            </button>
          )}
        </div>

        {showLoadingUI ? (
          <PostListSkeleton rows={12} showAuthor={false} />
        ) : (
          <>
            <div className="board-table-container">
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="col-no">번호</th>
                    <th className="col-title">제목</th>
                    <th className="col-date">등록일</th>
                    <th className="col-views">조회수</th>
                  </tr>
                </thead>

                <tbody>
                  {/* 1페이지에서만 상단 공지 2개 */}
                  {currentPage === 1 &&
                    topNotices.map((n) => (
                      <tr
                        key={`notice-${n.id}`}
                        onClick={() => handleNoticeClick(n.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="col-no">
                          <span
                            style={{
                              backgroundColor: "#215c26df",
                              opacity: 0.95,
                              color: "white",
                              padding: "3.3px 9px",
                              borderRadius: "4px",
                              fontSize: "12.6px",
                            }}
                          >
                            공지
                          </span>
                        </td>
                        <td className="col-title">{n.title}</td>
                        <td className="col-date">{n.date}</td>
                        <td className="col-views">{n.views}</td>
                      </tr>
                    ))}

                  {filteredUpdates.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => handleUpdateClick(p.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="col-no">{p.number}</td>
                      <td className="col-title">{p.title}</td>
                      <td className="col-date">{p.date}</td>
                      <td className="col-views">{p.views}</td>
                    </tr>
                  ))}

                  {currentPage === 1 &&
                    topNotices.length === 0 &&
                    filteredUpdates.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "30px 0", textAlign: "center" }}>
                          등록된 교회소식이 없습니다.
                        </td>
                      </tr>
                    )}

                  {currentPage !== 1 && filteredUpdates.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: "30px 0", textAlign: "center" }}>
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ minHeight: 64 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={updatePostsTotalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}