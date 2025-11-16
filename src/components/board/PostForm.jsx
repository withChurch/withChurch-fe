import React, { useRef, useState, useEffect } from "react";
import "./PostForm.css";
import { FilePlus } from "lucide-react";

export default function PostForm({
  breadcrumb = "홈 > 소통과 공감 > 자유게시판",
  pageTitle = "자유게시판",
  onSubmit,
  onCancel = () => {},
  initialTitle = "",
  initialContent = "",
}) {
  const editorRef = useRef(null);

  const [title, setTitle] = useState(initialTitle);

  const [isPlaceholder, setIsPlaceholder] = useState(!initialContent);

  useEffect(() => {
    if (!editorRef.current) return;

    if (initialContent) {
      // 수정 모드
      editorRef.current.innerHTML = initialContent;
      setIsPlaceholder(false);
    } else {
      // 새 글쓰기
      editorRef.current.innerHTML = "내용을 입력하세요";
      setIsPlaceholder(true);
    }
  }, [initialContent]);

  const clearPlaceholder = () => {
    if (isPlaceholder && editorRef.current) {
      editorRef.current.innerHTML = "";
      setIsPlaceholder(false);
    }
  };

  const setPlaceholder = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = "내용을 입력하세요";
    setIsPlaceholder(true);
  };

  const apply = (cmd, value = null) => {
    clearPlaceholder();
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleEditorFocus = () => clearPlaceholder();

  const handleEditorBlur = () => {
    if (!editorRef.current) return;

    const text = editorRef.current.innerText.replace(/\s/g, "");
    if (text === "") setPlaceholder();
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML.trim() || "";

    if (!title.trim()) return alert("제목을 작성하세요.");
    if (isPlaceholder || content === "" || content === "내용을 입력하세요")
      return alert("내용을 작성하세요.");

    onSubmit({ title, content });
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
        />
      </div>

      {/* 툴바 */}
      <div className="write-toolbar-wrapper">
        <div className="write-toolbar">
          <button onClick={() => apply("bold")}>B</button>
          <button onClick={() => apply("italic")}>I</button>
          <button onClick={() => apply("underline")}>U</button>

          <button onClick={() => apply("justifyLeft")}>≡</button>
          <button onClick={() => apply("justifyCenter")}>≣</button>
          <button onClick={() => apply("justifyRight")}>≡</button>
        </div>
      </div>

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

      <div className="write-file-section">
        <div className="write-file-header">
          <span>파일 첨부</span>
          <button className="file-tab">내 PC</button>
        </div>

        <div className="file-box">
          <div className="file-box-inner">
            <FilePlus className="file-icon" size={20} />
            <span className="file-text">파일을 마우스로 끌어오세요</span>
          </div>
        </div>
      </div>

      <div className="write-buttons">
        <button className="btn-save" onClick={handleSave}>저장</button>
        <button className="btn-cancel" onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}
