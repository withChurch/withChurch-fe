import React, { useEffect } from "react";
import { useBoard } from "../../contexts/BoardContext";
import SermonList from "../../components/sermons/SermonList"; 
import "../../components/sermons/SermonList.css";

export default function DawnSermonListPage() {
  const { 
    dawnPosts, 
    loadDawnPosts, 
    dawnPostsLoading 
  } = useBoard();

  useEffect(() => {
    loadDawnPosts();
  }, []);

  const formattedSermons = dawnPosts.map((post) => {
    const rawDate = post.createdAt || post.regDate || post.date || "";
    
    const dateStr = rawDate && rawDate.includes("T") 
      ? rawDate.split("T")[0] 
      : rawDate;

    return {
      ...post,
      id: post.postId || post.id, 
  
      title: post.title,
      date: dateStr || "날짜 미상",
      
      writer: post.UserName || post.writer || "관리자", 
      
    };
  });

  if (dawnPostsLoading) return <div>로딩 중...</div>;

  return (
    <SermonList
      title="새벽예배"
      sermons={formattedSermons}
      breadcrumb="◦ 생명의 말씀 > 새벽예배"
      writePath="/sermon/dawn/write"
      detailPath="/sermon/dawn"
    />
  );
}