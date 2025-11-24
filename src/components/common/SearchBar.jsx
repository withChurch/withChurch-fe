// src/components/common/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  searchType,
  setSearchType,
  keyword,
  setKeyword,
  setCurrentPage,
}) {
  return (
    <div
      className="board-actions"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{
            padding: "9px",
            border: "1px solid #c9c9c9",
            borderRadius: "5.8px",
            fontSize: "12.5px",
            backgroundPositionX: "calc(100% - 9px)",
          }}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>

        {/* 검색바 + 버튼 */}
        <div style={{ position: "relative", width: "250px" }}>
          <input
            type="text"
            placeholder="검색어를 입력해 주세요."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "9px",
              border: "1px solid #c9c9c9",
              borderRadius: "5.8px",
              width: "240px",
              fontSize: "13px",
            }}
          />

          <button
            type="button"
            style={{
              position: "absolute",
              right: "7.4px",
              top: "56%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Search size={18} color="#777" />
          </button>
        </div>
      </div>
    </div>
  );
}
