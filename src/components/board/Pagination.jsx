import React from "react";


export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="board-pagination">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`page-btn ${currentPage === num ? "active" : ""}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
