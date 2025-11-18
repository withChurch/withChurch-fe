// src/components/sermon/SermonDetail.jsx
import React from "react";
import "./SermonDetail.css";
import { useNavigate } from "react-router-dom";

export default function SermonDetail({
  titleLabel,
  breadcrumbLabel, 
  homePath,
  data,
  prev,
  next
}) {
  const navigate = useNavigate();

  if (!data) {
    return <div className="not-found">해당 예배 영상을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="sermon-detail-wrapper">
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>홈</span> &gt;{" "}
        <span onClick={() => navigate(homePath)}>생명의 말씀</span> &gt;{" "}
        <b>{breadcrumbLabel}</b>
      </div>

      <h1 className="sermon-title">{titleLabel}</h1>

      <div className="info-box">
        <div className="info-left">[{data.category}] {data.title}</div>
        <div className="info-right">
          <span>작성자: TAB</span>
          <span>등록일: {data.date}</span>
        </div>
      </div>

      <div className="video-box">
        <iframe
          src={`https://www.youtube.com/embed/${data.youtubeId}`}
          title="YouTube Sermon Video"
          allowFullScreen
        ></iframe>
      </div>

      <div className="sermon-content">{data.summary}</div>

      <div className="prev-next">
        <div className="pn-item">
          <span className="pn-label">이전글</span>
          {prev ? (
            <span
              className="pn-link"
              onClick={() => navigate(`${homePath}/${prev.id}`)}
            >
              {prev.date} {prev.title}
            </span>
          ) : (
            <span className="pn-none">이전 글이 없습니다.</span>
          )}
        </div>

        <div className="pn-item">
          <span className="pn-label">다음글</span>
          {next ? (
            <span
              className="pn-link"
              onClick={() => navigate(`${homePath}/${next.id}`)}
            >
              {next.date} {next.title}
            </span>
          ) : (
            <span className="pn-none">다음 글이 없습니다.</span>
          )}
        </div>
      </div>

      <div className="back-btn-wrap">
        <button className="back-btn" onClick={() => navigate(homePath)}>
          목록
        </button>
      </div>
    </div>
  );
}
