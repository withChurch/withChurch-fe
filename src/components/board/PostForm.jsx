import React, { useRef, useState, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./PostForm.css";
import Header from "../../components/common/Header";
import { FilePlus } from "lucide-react";

import api from "../../api/axios";

export default function PostForm({
  showHeader = true,
  headerTitle = "자유게시판 작성",
  headerBreadcrumb = "◦ 자유게시판 > 글쓰기",
  onSubmit,
  onCancel = () => {},
  initialTitle = "",
  initialContent = "",
  initialFiles = [],
  initialImages = [],
}) {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [attachedFiles, setAttachedFiles] = useState(initialFiles || []);
  const [isDragOver, setIsDragOver] = useState(false);

  const [uploadedImages, setUploadedImages] = useState(initialImages || []);
  // ----------------------------------------------------------------------
  // 1. 이미지 핸들러 (기능 원본 유지)
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
        formData.append("files", file);

        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

        const res = await api.post("/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const responseData = res.data;
        let imageUrl = null;
        let imageId = null;

        if (Array.isArray(responseData.data)) {
          const firstItem = responseData.data[0];
          if (typeof firstItem === 'string') {
            imageUrl = firstItem;
          } else if (firstItem && firstItem.imageUrl) {
            imageUrl = firstItem.imageUrl;
            imageId = firstItem.id || firstItem.imageId || firstItem.attachmentId;
          }
        } else if (responseData.data && responseData.data.imageUrl) {
          imageUrl = responseData.data.imageUrl;
          imageId = responseData.data.id || responseData.data.imageId || responseData.data.attachmentId;
        }

        if (!imageUrl) {
          console.error("이미지 URL 추출 실패. 응답 구조:", responseData);
          alert("서버에서 이미지 주소를 받아오지 못했습니다.");
          return;
        }

        console.log("🔗 최종 추출된 이미지 주소:", imageUrl);
        
        if (imageId) {
          console.log("📌 이미지 ID 획득:", imageId);
          setUploadedImages((prev) => [...prev, { id: imageId, url: imageUrl }]);
        }

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
  // 2. 에디터 설정
  // ----------------------------------------------------------------------
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [ "image", "video"],
        [{ align: [] }, { color: [] }, { background: [] }],
      ],
      handlers: {
        image: imageHandler,
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

    if (!title.trim()) return alert("제목을 작성해주세요.");

    const hasMedia = content.includes("<img") || content.includes("<iframe");
    if (plainText.length === 0 && !hasMedia) {
      return alert("내용을 작성해주세요.");
    }

    const doc = new DOMParser().parseFromString(content, "text/html");
    const imgTags = doc.querySelectorAll("img");
    const currentUrlsInEditor = Array.from(imgTags).map(img => img.src);

    const finalImageIds = uploadedImages
      .filter((img) => currentUrlsInEditor.includes(img.url))
      .map((img) => img.id);

    console.log("1. 지금까지 업로드한 이미지 목록:", uploadedImages);
    console.log("2. 현재 에디터에 살아있는 URL들:", currentUrlsInEditor);
    console.log("3. 백엔드로 전송될 살아남은 ID들:", finalImageIds);

    onSubmit({ title, content, files: attachedFiles, images: finalImageIds });
  };

  return (
    <>
      {showHeader && <Header title={headerTitle} breadcrumb={headerBreadcrumb} />}

      <div className="write-wrapper">
        <div className="write-paper">
          
          <div className="write-title-row">
            <input
              className="write-title-input-large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
            />
          </div>

          <div className="write-editor-container" style={{ marginBottom: "40px" }}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="내용을 입력해주세요."
              style={{ height: "450px" }}
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
            <button className="btn-cancel" onClick={onCancel}>취소</button>
            <button className="btn-save" onClick={handleSave}>저장</button>
          </div>

        </div>
      </div>
    </>
  );
}