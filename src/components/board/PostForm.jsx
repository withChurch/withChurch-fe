import React from "react";
import "./PostForm.css";
import { Paperclip } from "lucide-react";

const PostForm = ({
  title,
  setTitle,
  content,
  setContent,
  file,
  setFile,
  onSubmit,
  submitLabel = "등록",
}) => {
  return (
    <div className="postform-page">

      {/* 제목 입력 */}
      <div className="postform-row">
        <div className="postform-label">제목</div>
        <div className="postform-value">
          <input
            type="text"
            className="postform-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>
      </div>

      {/* 내용 입력 */}
      <div className="postform-row">
        <div className="postform-label">내용</div>
        <div className="postform-value">
          <textarea
            className="postform-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>

      {/* 첨부파일 */}
      <div className="postform-row">
        <div className="postform-label">첨부파일</div>
        <div className="postform-value postform-file-value">
          <Paperclip size={18} className="postform-file-icon" />
          <input
            type="file"
            className="postform-file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <span className="postform-file-name">{file.name}</span>}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="postform-button-wrap">
        <button className="postform-submit" onClick={onSubmit}>
          {submitLabel}
        </button>
      </div>

    </div>
  );
};

export default PostForm;
