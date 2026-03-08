import React from "react";
import { Paperclip } from "lucide-react";
import "./PostDetail.css"; 
import * as attachmentAPI from "../../api/attachmentAPI";

export default function PostDetail({
  breadcrumb,
  title,
  author = "TAB",
  date,
  content,
  files = [],
  onBack,
  onEdit,
  onDelete,
}) {

  const imageFiles = Array.isArray(files)
    ? files.filter(f => f && f instanceof File && f.type && f.type.startsWith("image/"))
    : [];

  const handleDownload = async (f) => {
    if (!f) return;

    if (f instanceof File || f instanceof Blob) {
      const url = URL.createObjectURL(f);
      const link = document.createElement("a");
      link.href = url;
      link.download = f.name || "download";
      link.click();
      URL.revokeObjectURL(url);
    } 
    else if (f.id || f.attachmentId) {
      const attachmentId = f.id || f.attachmentId;
      const fileName = f.name || f.fileName || "download";
      try {
        await attachmentAPI.downloadAttachment(attachmentId, fileName);
      } catch (error) {
        alert("파일 다운로드에 실패했습니다.");
        console.error("다운로드 오류:", error);
      }
    } 
    else if (typeof f === "string") {
      window.open(f, "_blank");
    }
  };

  const formatSize = (size) => {
    if (!size) return "0 KB";
    if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
    return (size / 1024).toFixed(1) + " KB";
  };

  const restoreYoutubeEmbeds = (htmlContent) => {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return "";
    }

    try {
      if (htmlContent.includes("<iframe")) return htmlContent;

      return htmlContent.replace(
        /<a href="(https:\/\/www\.youtube\.com\/embed\/[^"]+)(?:\?.*?)?">.*?<\/a>/g,
        (match, url) => {
          const cleanUrl = url.split('?')[0]; 
          return `<iframe src="${cleanUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
      );
    } catch (err) {
      console.error("유튜브 변환 중 에러 발생 (원본 표시):", err);
      return htmlContent;
    }
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
          className="view-content"
          dangerouslySetInnerHTML={{ __html: restoreYoutubeEmbeds(content) }}
        />
      </div>

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          {Array.isArray(files) && files.length > 0 ? (
            files.map((file, idx) => {
              if (!file) return null;

              const fileName = file.fileName || file.name || "파일";
              const fileSize = file.fileSize || file.size || 0;
              const sizeText = formatSize(fileSize);

              return (
                <button
                  key={idx}
                  type="button"
                  className="file-item-btn"
                  onClick={() => handleDownload(file)}
                >
                  <Paperclip size={18} className="file-icon" />
                  <span className="file-name">
                    {fileName}{" "}
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
        
        <div className="right-btn-group">
          {onEdit && (
            <button className="edit-btn" onClick={onEdit}>
              수정
            </button>
          )}
          {onDelete && (
            <button className="delete-btn" onClick={onDelete}>
              삭제
            </button>
          )}
        </div>
      </div>
    </>
  );
}