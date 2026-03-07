import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBoard } from "../../contexts/BoardContext";
import SermonList from "../../components/sermons/SermonList";
import Pagination from "../../components/board/Pagination";
import "../../components/sermons/SermonList.css";
import Header from "../../components/common/Header";
import SermonListSkeleton from "../../components/skeleton/SermonListSkeleton";
import { useAuth } from "../../contexts/AuthContext";

export default function DawnSermonListPage() {
  const {
    dawnPosts,
    loadDawnPosts,
    dawnPostsLoading,
    dawnPostsTotalPages,
    boardMap,
  } = useBoard();

  const { user } = useAuth();

  const PAGE_SIZE = 6;
  const boardId = boardMap?.["새벽예배"];

  const [currentPage, setCurrentPage] = useState(1);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (prevLoadingRef.current === true && dawnPostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = dawnPostsLoading;
  }, [dawnPostsLoading]);

  useEffect(() => {
    if (!boardId) return;

    loadDawnPosts(currentPage - 1, {
      size: PAGE_SIZE,
      sort: "createdAt,desc",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, boardId]);

  const formattedSermons = useMemo(() => {
    const list = Array.isArray(dawnPosts) ? dawnPosts : [];

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
  }, [dawnPosts]);

  const handlePageChange = (page) => {
    if (page < 1 || page > dawnPostsTotalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLoadingUI = !boardId || dawnPostsLoading || !hasFetchedOnce;

  return (
    <>
      <Header breadcrumb="> 생명의 말씀 > 새벽예배" title="새벽예배" />

      {showLoadingUI ? (
        <SermonListSkeleton
          cards={PAGE_SIZE}
          showUploadButton={user?.role === "ADMIN"}
        />
      ) : (
        <>
          <SermonList
            sermons={formattedSermons}
            writePath="/sermon/dawn/write"
            detailPath="/sermon/dawn"
            emptyText="등록된 새벽예배 설교가 없습니다."
            emptySearchText="검색 결과가 없습니다."
          />

          <div style={{ minHeight: 64 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={dawnPostsTotalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
}