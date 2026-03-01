import React, { useEffect, useMemo, useRef, useState } from "react";
import SermonList from "../../components/sermons/SermonList";
import { useBoard } from "../../contexts/BoardContext";
import Header from "../../components/common/Header";
import SermonListSkeleton from "../../components/skeleton/SermonListSkeleton";
import { useAuth } from "../../contexts/AuthContext";

export default function SundaySermonListPage() {
  const { sundayPosts, loadSundayPosts, sundayPostsLoading, boardMap } = useBoard();
  const { user } = useAuth();

  const boardId = boardMap?.["주일예배"];

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
    loadSundayPosts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const formattedSermons = useMemo(() => {
    const list = Array.isArray(sundayPosts) ? sundayPosts : [];

    return list.map((post) => {
      const rawDate = post.createdAt || post.regDate || post.date || "";
      const dateStr = rawDate && rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;

      return {
        ...post,
        id: post.postId || post.id,
        title: post.title,
        date: dateStr || "날짜 미상",
        writer: post.UserName || post.writer || post.author || "관리자",
      };
    });
  }, [sundayPosts]);

  const showLoadingUI = !boardId || sundayPostsLoading || !hasFetchedOnce;

  return (
    <>
      <Header breadcrumb="> 생명의 말씀 > 주일예배" title="주일예배" />

      {showLoadingUI ? (
        <SermonListSkeleton
          cards={6}
          showUploadButton={user?.role === "ADMIN"}
        />
      ) : (
        <SermonList
          sermons={formattedSermons}
          writePath="/sermon/sunday/write"
          detailPath="/sermon/sunday"
          emptyText="등록된 주일예배 설교가 없습니다."
          emptySearchText="검색 결과가 없습니다."
        />
      )}
    </>
  );
}