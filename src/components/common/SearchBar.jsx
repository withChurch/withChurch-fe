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
    <div className="board-actions searchbar-actions">
      <div className="searchbar-controls">
        <select
          className="searchbar-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>

        <div className="searchbar-inputwrap">
          <input
            className="searchbar-input"
            type="text"
            placeholder="검색어를 입력해 주세요."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="searchbar-iconbtn" type="button">
            <Search size={18} color="#777" />
          </button>
        </div>
      </div>
    </div>
  );
}
