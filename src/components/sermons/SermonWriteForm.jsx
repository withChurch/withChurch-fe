import React, { useState } from "react";
import "./SermonWriteForm.css";
import { useNavigate } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";

export default function SermonWriteForm({ category }) {
  const navigate = useNavigate();
  const { addSermon, addDawnSermon } = useSermon();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

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
    if (!youtubeId || !title) {
      alert("제목과 유튜브 주소는 필수 항목입니다.");
      return;
    }

    const newData = {
      category,
      youtubeId,
      title,
      summary,
      date: new Date().toISOString().slice(0, 10),
    };

    let newPost;
    if (category === "주일예배") {
      newPost = addSermon(newData);
      navigate(`/sermon/sunday/${newPost.id}`);
    } else {
      newPost = addDawnSermon(newData);
      navigate(`/sermon/dawn/${newPost.id}`);
    }
  };

  return (
    <div className="sermon-write-wrapper">
      <h1 className="write-title">
        {category} 올리기
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
        <button className="submit-btn" onClick={handleSubmit}>
          등록
        </button>
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
}
