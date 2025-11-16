import React from "react";
import { Paperclip } from "lucide-react";
import "./PostDetail.css";

export default function PostDetail({
  breadcrumb,
  title,
  author = "TAB",
  date,
  content,
  file,       // 예전 문자열 파일 대비
  files = [],
  onBack,
  onEdit,
}) {


  const imageFiles = Array.isArray(files)
    ? files.filter(f => f && f.type && f.type.startsWith("image/"))
    : [];


  const handleDownload = (f) => {
    if (!f) return;

    if (f instanceof File || f instanceof Blob) {
      const url = URL.createObjectURL(f);
      const link = document.createElement("a");
      link.href = url;
      link.download = f.name || "download";
      link.click();
      URL.revokeObjectURL(url);
    } else if (typeof f === "string") {
      window.open(f, "_blank");
    }
  };
  const formatSize = (size) => {
    if (!size) return "0 KB";
    if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
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

      <div className="detail-content">

        {imageFiles.length > 0 && (
          <div className="detail-image-preview">
            {imageFiles.map((img, idx) => {
              const src = URL.createObjectURL(img);
              return (
                <img
                  key={idx}
                  src={src}
                  alt="첨부 이미지"
                  className="preview-img"
                />
              );
            })}
          </div>
        )}

        <div
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          {Array.isArray(files) && files.length > 0 ? (
            files.map((file, idx) => {
              if (!file) return null;

              const sizeText = formatSize(file.size);

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
