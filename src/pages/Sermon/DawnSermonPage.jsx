// src/pages/Sermon/DawnSermonPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";
import SermonDetail from "../../components/sermons/SermonDetail";

export default function DawnSermonPage() {
  const { id } = useParams();
  const { dawnSermons } = useSermon();

  const sermonId = Number(id);
  const sermon = dawnSermons.find((s) => s.id === sermonId);

  const prev = dawnSermons.find((s) => s.id === sermonId - 1);
  const next = dawnSermons.find((s) => s.id === sermonId + 1);

  return (
    <SermonDetail
      titleLabel="새벽 예배"
      breadcrumbLabel="새벽예배"
      homePath="/sermon/dawn"
      data={sermon}
      prev={prev}
      next={next}
    />
  );
}
