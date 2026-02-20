import React, { useEffect } from "react";
import SermonList from "../../components/sermons/SermonList"; 
import { useBoard } from "../../contexts/BoardContext";
import Header from "../../components/common/Header";

export default function SundaySermonListPage() {

  const { sundayPosts, loadSundayPosts } = useBoard();

  useEffect(() => {
    loadSundayPosts(); 
  }, []);

  return (
    <>
    <Header
      breadcrumb="> 생명의 말씀 > 주일예배" 
      title="주일예배"
    />

    <SermonList
      sermons={sundayPosts}
      writePath="/sermon/sunday/write"
      detailPath="/sermon/sunday"
    />
    </>

    
  );
}