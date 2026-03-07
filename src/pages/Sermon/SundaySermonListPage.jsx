import React, { useEffect, useMemo, useRef, useState } from "react";
import SermonList from "../../components/sermons/SermonList";
import Pagination from "../../components/board/Pagination";
import { useBoard } from "../../contexts/BoardContext";
import Header from "../../components/common/Header";
import SermonListSkeleton from "../../components/skeleton/SermonListSkeleton";
import { useAuth } from "../../contexts/AuthContext";

export default function SundaySermonListPage() {
  const {
    sundayPosts,
    loadSundayPosts,
    sundayPostsLoading,
    sundayPostsTotalPages,
    boardMap,
  } = useBoard();

  const { user } = useAuth();

  const PAGE_SIZE = 6;
  const boardId = boardMap?.["주일예배"];

  const [currentPage, setCurrentPage] = useState(1);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && sundayPostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = sundayPostsLoading;
  }, [sundayPostsLoading]);

  useEffect(() => {
    if (!boardId) return;

    loadSundayPosts(currentPage - 1, {
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, boardId]);

  const formattedSermons = useMemo(() => {
    const list = Array.isArray(sundayPosts) ? sundayPosts : [];

    return list.map((post) => {
      const rawDate = post.createdAt || post.regDate || post.date || "";
      const dateStr =
        rawDate && rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;

      return {
        ...post,
        id: post.postId || post.id,
        title: post.title || "제목 없음",
        date: dateStr || post.date || "날짜 미상",
        writer:
          post.writer ||
          post.writerName ||
          post.author ||
          post.UserName ||
          "관리자",
      };
    });
  }, [sundayPosts]);

  const handlePageChange = (page) => {
    if (page < 1 || page > sundayPostsTotalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLoadingUI = !boardId || sundayPostsLoading || !hasFetchedOnce;

  return (
    <>
      <Header breadcrumb="> 생명의 말씀 > 주일예배" title="주일예배" />

      {showLoadingUI ? (
        <SermonListSkeleton
          cards={PAGE_SIZE}
          showUploadButton={user?.role === "ADMIN"}
        />
      ) : (
        <>
          <SermonList
            sermons={formattedSermons}
            writePath="/sermon/sunday/write"
            detailPath="/sermon/sunday"
            emptyText="등록된 주일예배 설교가 없습니다."
            emptySearchText="검색 결과가 없습니다."
          />

          <div style={{ minHeight: 64 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={sundayPostsTotalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
}