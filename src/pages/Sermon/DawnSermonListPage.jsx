// src/pages/Sermon/DawnSermonListPage.jsx
import React from "react";
import { useSermon } from "../../contexts/SermonContext";
import SermonList from "../../components/sermons/SermonList"; 
import "../../components/sermons/SermonList.css";

export default function DawnSermonListPage() {
  const { dawnSermons } = useSermon();

  return (
    <SermonList
      title="새벽예배"
      sermons={dawnSermons}
      breadcrumb="> 생명의말씀 > 새벽예배"
      writePath="/sermon/dawn/write"
      detailPath="/sermon/dawn"
    />
  );
}
