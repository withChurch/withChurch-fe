import React from "react";
import { useParams } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";
import SermonDetail from "../../components/sermons/SermonDetail";

export default function SundaySermonPage() {
  const { id } = useParams();
  const { sermons } = useSermon();

  const sermonId = Number(id);
  const sermon = sermons.find((s) => s.id === sermonId);

  const prev = sermons.find((s) => s.id === sermonId - 1);
  const next = sermons.find((s) => s.id === sermonId + 1);

  return (
    <SermonDetail
      titleLabel="주일 예배"
      breadcrumbLabel="주일예배"
      homePath="/sermon/sunday"
      data={sermon}
      prev={prev}
      next={next}
    />
  );
}
