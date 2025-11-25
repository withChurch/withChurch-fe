import React, { useState } from "react";
import "./SermonWriteForm.css";
import { useNavigate } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";

export default function SermonWriteForm({
  category,
  mode = "write",                   
  pageTitle,                        
  initialYoutubeId = "",
  initialYoutubeUrl = "",
  initialTitle = "",
  initialSummary = "",
  onSubmit,                         
  onDelete,
  breadcrumb                          
}) {
  const navigate = useNavigate();
  const { addSermon, addDawnSermon } = useSermon();

  const [youtubeUrl, setYoutubeUrl] = useState(initialYoutubeUrl);
  const [youtubeId, setYoutubeId] = useState(initialYoutubeId);
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);

  const extractId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setYoutubeId(extractId(url));
  };

  const handleSubmit = () => {
    if (!title) {
      alert("제목은 필수 항목입니다.");
      return;
    }

    const submitData = {
      category,
      youtubeId,
      title,
      summary,
      date: new Date().toISOString().slice(0, 10),
    };

    if (mode === "write") {
      if (!youtubeId) {
        alert("유튜브 주소는 필수입니다.");
        return;
      }

      let newPost;
      if (category === "주일예배") {
        newPost = addSermon(submitData);
        navigate(`/sermon/sunday/${newPost.id}`);
      } else {
        newPost = addDawnSermon(submitData);
        navigate(`/sermon/dawn/${newPost.id}`);
      }
    } else {
      onSubmit({
        youtubeId,
        title,
        summary
      });
    }
  };

  return (
    <div className="sermon-write-wrapper">
        <div className="write-breadcrumb">
          <span>{breadcrumb}</span>
        </div>

      <h1 className="write-title">
        {pageTitle ? pageTitle : `${category}`}
      </h1>

      <div className="input-group">
        <label>유튜브 주소</label>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=xxxxxx"
          value={youtubeUrl}
          onChange={handleUrlChange}
        />
      </div>

      {youtubeId && (
        <div className="video-preview">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="preview"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="input-group">
        <label>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>요약</label>
        <textarea
          placeholder="요약 내용을 입력하세요"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        ></textarea>
      </div>

      <div className="summary-divider"></div>

      <div className="btn-row">
        {mode === "edit" && (
          <button className="sermon-delete-btn" onClick={onDelete}>
            삭제
          </button>
        )}

        <button className="submit-btn" onClick={handleSubmit}>
          {mode === "edit" ? "저장" : "등록"}
        </button>

        <button className="cancel-btn" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
}
