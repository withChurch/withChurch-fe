import React, { useMemo, useState } from "react";
import "./SermonList.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../board/Pagination";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useBoard } from "../../contexts/BoardContext";

export default function SermonList({
  sermons,
  writePath,
  detailPath,
  emptyText = "등록된 설교가 없습니다.",
  emptySearchText = "검색 결과가 없습니다.",
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const board = useBoard();

  const safeSermons = Array.isArray(sermons) ? sermons : [];

  const isSunday = String(detailPath || "").includes("/sermon/sunday");
  const isDawn = String(detailPath || "").includes("/sermon/dawn");

  const canServerPaging =
    (isSunday && typeof board.loadSundayPosts === "function") ||
    (isDawn && typeof board.loadDawnPosts === "function");

  const [searchInput, setSearchInput] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const serverTotalPages = useMemo(() => {
    if (!canServerPaging) return 1;
    if (isSunday) return board.sundayPostsTotalPages || 1;
    if (isDawn) return board.dawnPostsTotalPages || 1;
    return 1;
  }, [
    canServerPaging,
    isSunday,
    isDawn,
    board.sundayPostsTotalPages,
    board.dawnPostsTotalPages,
  ]);

  const fetchServerPage = (page, keyword) => {
    if (!canServerPaging) return;

    const pageIdx = Math.max(0, (page || 1) - 1);
    const kw = (keyword ?? "").trim();

    if (isSunday) {
      board.loadSundayPosts(pageIdx, {
        size: pageSize,
        sort: "createdAt,desc",
        keyword: kw,
      });
    } else if (isDawn) {
      board.loadDawnPosts(pageIdx, {
        size: pageSize,
        sort: "createdAt,desc",
        keyword: kw,
      });
    }
  };

  const handleSearch = () => {
    const kw = searchInput.trim();
    setAppliedKeyword(kw);
    setCurrentPage(1);

    fetchServerPage(1, kw);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    fetchServerPage(page, appliedKeyword);
  };


  const items = safeSermons;

  const isSearching = appliedKeyword.trim().length > 0;
  const emptyMessage = isSearching ? emptySearchText : emptyText;

  return (
    <div className="sermon-list-wrapper">
      <div className="search-upload-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              // 한글 조합중 Enter 방지
              if (e.key === "Enter" && !e.isComposing) handleSearch();
            }}
          />
          <Search className="search-icon1" size={18} onClick={handleSearch} />
        </div>

        {user?.role === "ADMIN" && (
          <button className="upload-btn" onClick={() => navigate(writePath)}>
            예배 올리기 <Plus size={16} />
          </button>
        )}
      </div>

      <div className="sermon-card-grid">
        {items.length === 0 ? (
          <div className="sermon-empty-state">{emptyMessage}</div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id || index}
              className="sermon-card"
              onClick={() => {
                if (item.id) navigate(`${detailPath}/${item.id}`);
              }}
            >
              <div className="card-tag">주후 {item.date}</div>
              <div className="card-title">{item.title}</div>
            </div>
          ))
        )}
      </div>

      <div className="pagination-wrap">
        <Pagination
          currentPage={currentPage}
          totalPages={canServerPaging ? serverTotalPages : 1}
          onPageChange={handlePageChange}
          windowSize={5}
        />
      </div>
    </div>
  );
}