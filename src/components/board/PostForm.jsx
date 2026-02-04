import React, { useRef, useState, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";// Quill 스타일 시트
import "./PostForm.css";
import { FilePlus } from "lucide-react";

export default function PostForm({
  breadcrumb = "홈 > 소통과 공감 > 자유게시판",
  pageTitle = "자유게시판",
  onSubmit,
  onCancel = () => {},
  initialTitle = "",
  initialContent = "", 
  initialFiles = [],
}) {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [attachedFiles, setAttachedFiles] = useState(initialFiles || []);
  const [isDragOver, setIsDragOver] = useState(false);

  // ----------------------------------------------------------------------
  // 1. 이미지 핸들러 (본문 삽입용) - /api/attachments/upload 연동
  // ----------------------------------------------------------------------
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        
        formData.append("file", file); 

        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

        const res = await fetch("https://api.withchurch.site/api/images/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error("이미지 업로드 실패");

        const responseData = await res.json();
        
        const imageUrl = responseData.data.imageUrl; 

        console.log("🔗 서버에서 받은 이미지 주소:", imageUrl); 

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        
        editor.insertEmbed(range.index, "image", imageUrl);
        editor.setSelection(range.index + 1);

      } catch (error) {
        console.error("에러 발생:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      }
    };
  };
  // ----------------------------------------------------------------------
  // 2. 에디터 설정 (툴바 및 핸들러 연결)
  // ----------------------------------------------------------------------
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"], // 이미지, 비디오(유튜브) 버튼
        [{ align: [] }, { color: [] }, { background: [] }],
      ],
      handlers: {
        image: imageHandler, // 기본 동작 대신 우리가 만든 핸들러 실행
      },
    },
  }), []);

  const appendFiles = (fileList) => {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setAttachedFiles((prev) => [...prev, ...arr]);
  };

  const handleFileChange = (e) => {
    appendFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false);
    appendFiles(e.dataTransfer.files);
  };

  const handleSave = () => {
    const plainText = content.replace(/<[^>]+>/g, "").trim();

    if (!title.trim()) return alert("제목을 작성하세요.");
    
    const hasMedia = content.includes("<img") || content.includes("<iframe");
    if (plainText.length === 0 && !hasMedia) {
      return alert("내용을 작성하세요.");
    }

    onSubmit({ title, content, files: attachedFiles });
  };

  return (
    <div className="write-wrapper">
      <div className="write-breadcrumb">
        <span>{breadcrumb}</span>
      </div>

      <div className="write-title-page">{pageTitle}</div>

      <div className="write-row">
        <div className="write-label">
          <span className="write-label-text">제목</span>
        </div>
        <input
          className="write-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="write-editor-container" style={{ marginBottom: "60px" }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="내용을 입력하세요."
          style={{ height: "400px" }} 
        />
      </div>

      <div className="write-file-section">
        <div className="write-file-header">
          <span>일반 파일 첨부</span>
          <button
            type="button"
            className="pc-upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            내 PC
          </button>
        </div>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div
          className={`file-box${isDragOver ? " drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
          onDrop={handleDrop}
        >
          <div className="file-box-inner">
            <FilePlus className="file-icon" size={20} />
            <span className="file-text">파일을 마우스로 끌어오세요</span>
          </div>
        </div>

        <ul className="file-list">
          {attachedFiles.map((file, idx) => (
            <li key={idx} className="file-item-box">
              <span className="file-name">{file.name || file.fileName || "파일"}</span>
              <button
                type="button"
                className="file-delete-btn"
                onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="write-buttons">
        <button className="btn-save" onClick={handleSave}>저장</button>
        <button className="btn-cancel" onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}