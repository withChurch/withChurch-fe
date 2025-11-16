import React from "react";
import { Paperclip } from "lucide-react";
import "./PostDetail.css";

export default function PostDetail({
  breadcrumb,
  title,
  author = "TAB",
  date,
  content,
  file,       // 예전처럼 문자열로 받는 경우 대비
  files = [], 
  onBack,
  onEdit,
}) {

  const handleDownload = (f) => {
    if (!f) return;

    // 나중에 API 붙이면 여기서 f.url로 교체 가능
    if (f instanceof File || f instanceof Blob) {
      const url = URL.createObjectURL(f);
      const link = document.createElement("a");
      link.href = url;
      link.download = f.name || "download";
      link.click();
      URL.revokeObjectURL(url);
    } else if (typeof f === "string") {
      // 만약 나중에 문자열 URL을 받게 되면 여기서 처리
      window.open(f, "_blank");
    }
  };
  const formatSize = (size) => {
  if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
  return (size / 1024).toFixed(1) + " KB";
};


  return (
    <>
      <div className="detail-breadcrumb">
        <span>{breadcrumb}</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{title}</div>

        <div className="title-meta">
          <span className="detail-author">{author}</span>
          <span className="title-date">{date}</span>
        </div>
      </div>

      <div className="detail-divider" />

      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          {Array.isArray(files) && files.length > 0 ? (
            files.map((file, idx) => {
              // file이 없을 때 안전장치
              if (!file) return null;

              const ext =
                typeof file.name === "string" && file.name.includes(".")
                  ? file.name.split(".").pop().toLowerCase()
                  : "";

              const sizeText = file.size
                ? file.size >= 1024 * 1024
                  ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
                  : (file.size / 1024).toFixed(1) + " KB"
                : "0 KB";

              return (
                <button
                  key={idx}
                  type="button"
                  className="file-item-btn"
                  onClick={() => handleDownload(file)}
                >
                  <Paperclip size={18} className="file-icon" />

                  <span className="file-name">
                    {file.name}{" "}
                    <span style={{ color: "#888", fontSize: "14px" }}>
                      ({sizeText})
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <span className="file-name">첨부된 파일이 없습니다.</span>
          )}
        </div>

      </div>

      <div className="detail-button-wrap">
        <button className="back-btn" onClick={onBack}>
          목록
        </button>
        <button className="edit-btn" onClick={onEdit}>
          수정
        </button>
      </div>
    </>
  );
}
