import React, { useMemo, useState } from "react";
import "./SermonList.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../board/Pagination";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SermonList({
  sermons,
  writePath,
  detailPath,

  // ✅ 추가: 비어있을 때 메시지
  emptyText = "등록된 설교가 없습니다.",
  emptySearchText = "검색 결과가 없습니다.",
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const safeSermons = sermons || [];

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return safeSermons;

    return safeSermons.filter((s) =>
      String(s.title || "").toLowerCase().includes(kw)
    );
  }, [safeSermons, searchKeyword]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const items = filtered.slice(startIdx, startIdx + itemsPerPage);

  const isSearching = searchKeyword.trim().length > 0;
  const emptyMessage = isSearching ? emptySearchText : emptyText;

  return (
    <div className="sermon-list-wrapper">
      <div className="search-upload-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          {/* 아이콘 클릭 시 검색되게 하고 싶으면 onClick 달아도 됨 */}
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
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          windowSize={5}
        />
      </div>
    </div>
  );
}