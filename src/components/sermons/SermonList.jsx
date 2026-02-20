import React, { useState } from "react";
import "./SermonList.css"; 
import { useNavigate } from "react-router-dom";
import Pagination from "../board/Pagination";
import { Search, Plus, Home } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SermonList({ sermons, writePath, detailPath, breadcrumb }) {
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

  const filtered = safeSermons.filter((s) =>
    s.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const items = filtered.slice(startIdx, startIdx + itemsPerPage);

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
          <Search className="search-icon" size={18} />
        </div>

        {user?.role === "ADMIN" && (
          <button
            className="upload-btn"
            onClick={() => navigate(writePath)}
          >
            예배 올리기 <Plus size={16} />
          </button>
        )}
      </div>

      <div className="sermon-card-grid">
        {items.map((item, index) => (
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
        ))}
      </div>

      <div className="pagination-wrap">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}