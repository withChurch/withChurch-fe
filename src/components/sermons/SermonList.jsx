// src/components/sermon/SermonList.jsx
import React, { useState } from "react";
import "./SermonList.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../board/Pagination";
import { Search, Plus } from "lucide-react";

export default function SermonList({ title, sermons, writePath, detailPath }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const filtered = sermons.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const items = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="sermon-list-wrapper">
      <h1 className="list-title">{title}</h1>

      <div className="search-upload-wrapper">

        <div className="search-box">
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="search-icon" size={18} />
        </div>

        <button
          className="upload-btn"
          onClick={() => navigate(writePath)}
        >
          예배 올리기 <Plus size={16} />
        </button>
      </div>

      <div className="sermon-card-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="sermon-card"
            onClick={() => navigate(`${detailPath}/${item.id}`)}
          >
            <div className="card-tag">주후 {item.date}</div>
            <div className="card-title">{item.title}</div>
            <div className="card-preacher">
              {item.summary.split("\n")[0]}
            </div>
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
