// src/pages/Sermons/SundaySermonEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";
import SermonWriteForm from "../../components/sermons/SermonWriteForm";

export default function SundaySermonEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sermons, updateSermon, deleteSermon } = useSermon();

  const sermonId = Number(id);
  const sermon = sermons.find((s) => s.id === sermonId);

  if (!sermon) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ title, summary, files }) => {
    updateSermon(sermonId, { title, summary, files });
    navigate(`/sermon/sunday/${sermonId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteSermon(sermonId);
      navigate("/sermon/sunday");
    }
  };

  return (
    <div className="sermon-edit-wrapper">
      <SermonWriteForm
        breadcrumb="◦ 생명의 말씀 > 주일예배 > 글수정"
        mode="edit"
        category="주일예배"
        pageTitle="주일예배 수정"
        initialYoutubeId={sermon.youtubeId}
        initialYoutubeUrl={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
        initialTitle={sermon.title}
        initialSummary={sermon.summary}
        onSubmit={handleSubmit}
        onDelete={handleDelete}   
      />
    </div>
  );
}
