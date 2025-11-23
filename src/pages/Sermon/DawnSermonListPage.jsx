// src/pages/Sermon/DawnSermonListPage.jsx
import React from "react";
import { useSermon } from "../../contexts/SermonContext";
import SermonList from "../../components/sermons/SermonList"; 
import "../../components/sermons/SermonList.css";

export default function DawnSermonListPage() {
  const { dawnSermons } = useSermon();

  return (
    <SermonList
      title="새벽예배 목록"
      sermons={dawnSermons}
      writePath="/sermon/dawn/write"
      detailPath="/sermon/dawn"
    />
  );
}
