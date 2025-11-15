// src/components/board/PostForm.jsx
import React, { useRef, useState, useEffect } from "react";
import "./PostForm.css";
import { FilePlus } from "lucide-react";

export default function PostForm({
  breadcrumb = "홈 > 소통과 공감 > 자유게시판",
  pageTitle = "자유게시판",
  onSubmit,
  onCancel = () => {},
}) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [isPlaceholder, setIsPlaceholder] = useState(true);

  // 처음 로드될 때 placeholder 세팅
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "내용을 입력하세요";
    }
  }, []);

  const clearPlaceholder = () => {
    if (isPlaceholder && editorRef.current) {
      editorRef.current.innerHTML = "";
      setIsPlaceholder(false);
    }
  };

  const setPlaceholder = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "내용을 입력하세요";
      setIsPlaceholder(true);
    }
  };

  const apply = (cmd, value = null) => {
    clearPlaceholder();
    document.execCommand(cmd, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleEditorFocus = () => {
    clearPlaceholder();
  };

  const handleEditorBlur = () => {
    if (
      editorRef.current &&
      editorRef.current.innerText.replace(/\s/g, "") === ""
    ) {
      setPlaceholder();
    }
  };

  const handleSave = () => {
    const content = editorRef.current ? editorRef.current.innerHTML.trim() : "";

    if (!title.trim()) {
      alert("제목을 작성하세요.");
      return;
    }

    if (isPlaceholder || content === "" || content === "내용을 입력하세요") {
      alert("내용을 작성하세요.");
      return;
    }

    if (onSubmit) {
      onSubmit({ title, content });
    }
  };


  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="write-wrapper">
      {/* 경로 */}
      <div className="write-breadcrumb">
        <span>{breadcrumb}</span>
      </div>

      {/* 페이지 제목 */}
      <div className="write-title-page">{pageTitle}</div>

      {/* 제목 줄 */}
      <div className="write-row">
        <div className="write-label">
          <span className="write-label-text">제목</span>
        </div>
        <input
          className="write-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 툴바 */}
      <div className="write-toolbar-wrapper">
        <div className="write-toolbar">
          <button
            type="button"
            onClick={() => apply("bold")}
            title="굵게"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => apply("italic")}
            title="기울임"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => apply("underline")}
            title="밑줄"
          >
            U
          </button>

          <button
            type="button"
            onClick={() => apply("justifyLeft")}
            title="왼쪽 정렬"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => apply("justifyCenter")}
            title="가운데 정렬"
          >
            ≣
          </button>
          <button
            type="button"
            onClick={() => apply("justifyRight")}
            title="오른쪽 정렬"
          >
            ≡
          </button>
        </div>
      </div>

      {/* 본문 에디터 */}
      <div className="write-editor-container">
        <div
          ref={editorRef}
          className={
            "write-editor" + (isPlaceholder ? " write-editor-placeholder" : "")
          }
          contentEditable
          suppressContentEditableWarning={true}
          onFocus={handleEditorFocus}
          onBlur={handleEditorBlur}
        />
      </div>

      {/* 파일 첨부 */}
      <div className="write-file-section">
        <div className="write-file-header">
          <span>파일 첨부</span>
          <button className="file-tab">내 PC</button>
        </div>

        <div className="file-box">
          <div className="file-box-inner">
            <FilePlus
              className="file-icon"
              size={20}
              strokeWidth={1.7}
              color="#999"
            />
            <span className="file-text">파일을 마우스로 끌어오세요</span>
          </div>
        </div>
      </div>

      {/* 저장/취소 버튼 */}
      <div className="write-buttons">
        <button className="btn-save" type="button" onClick={handleSave}>
          저장
        </button>
        <button className="btn-cancel" type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
}
