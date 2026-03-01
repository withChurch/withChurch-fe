import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBoard } from "../../contexts/BoardContext";
import SermonList from "../../components/sermons/SermonList";
import "../../components/sermons/SermonList.css";
import Header from "../../components/common/Header";
import SermonListSkeleton from "../../components/skeleton/SermonListSkeleton";
import { useAuth } from "../../contexts/AuthContext";

export default function DawnSermonListPage() {
  const { dawnPosts, loadDawnPosts, dawnPostsLoading, boardMap } = useBoard();
  const { user } = useAuth();

  const boardId = boardMap?.["새벽예배"];

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const prevLoadingRef = useRef(false);

  const requestedRef = useRef(false);

  useEffect(() => {
    if (!boardId) return;
    if (requestedRef.current) return;
    requestedRef.current = true;

    loadDawnPosts(0); // page=0 (default가 0이면 loadDawnPosts()만 호출해도 됨)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    if (prevLoadingRef.current === true && dawnPostsLoading === false) {
      setHasFetchedOnce(true);
    }
    prevLoadingRef.current = dawnPostsLoading;
  }, [dawnPostsLoading]);

  const formattedSermons = useMemo(() => {
    const list = Array.isArray(dawnPosts) ? dawnPosts : [];

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
  }, [dawnPosts]);

  const showLoadingUI = !boardId || dawnPostsLoading || !hasFetchedOnce;

  return (
    <>
      <Header breadcrumb="> 생명의 말씀 > 새벽예배" title="새벽예배" />

      {showLoadingUI ? (
        <SermonListSkeleton cards={6} showUploadButton={user?.role === "ADMIN"} />
      ) : (
        <SermonList
          sermons={formattedSermons}
          writePath="/sermon/dawn/write"
          detailPath="/sermon/dawn"
          emptyText="등록된 새벽예배 설교가 없습니다."
          emptySearchText="검색 결과가 없습니다."
        />
      )}
    </>
  );
}