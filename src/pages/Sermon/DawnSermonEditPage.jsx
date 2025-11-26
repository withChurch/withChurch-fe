// src/pages/Sermons/DawnSermonEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";
import SermonWriteForm from "../../components/sermons/SermonWriteForm";

function DawnSermonEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dawnSermons, updateDawnSermon, deleteDawnSermon } = useSermon();

  const sermonId = Number(id);
  const sermon = dawnSermons.find((s) => s.id === sermonId);

  if (!sermon) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ youtubeId, title, summary }) => {
    updateDawnSermon(sermonId, {
      youtubeId,
      title,
      summary
    });

    navigate(`/sermon/dawn/${sermonId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteDawnSermon(sermonId);
      navigate("/sermon/dawn");
    }
  };

  return (
    <div className="sermon-edit-wrapper">
      <SermonWriteForm
        breadcrumb="◦ 생명의 말씀 > 새벽예배 > 글수정"
        mode="edit"
        category="새벽예배"
        pageTitle="새벽예배 수정"

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

export default DawnSermonEditPage;
