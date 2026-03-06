import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  keyword,
  setKeyword,
  onSubmit,
}) {
  const submit = () => {
    if (onSubmit) onSubmit();
  };

  return (
    <div className="board-actions searchbar-actions">
      <div className="searchbar-controls">
        <div className="searchbar-inputwrap">
          <input
            className="searchbar-input"
            type="text"
            placeholder="제목 또는 내용으로 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.isComposing) {
                submit();
              }
            }}
          />

          <button
            className="searchbar-iconbtn"
            type="button"
            onClick={submit}
            aria-label="검색"
          >
            <Search size={18} color="#777" />
          </button>
        </div>
      </div>
    </div>
  );
}