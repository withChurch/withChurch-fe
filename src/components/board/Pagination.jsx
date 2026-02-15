import React, { useMemo } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 5, // 기본 5개
}) {
  const pages = useMemo(() => {
    if (!totalPages || totalPages <= 1) return [];

    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + windowSize - 1);

    start = Math.max(1, end - windowSize + 1);

    const result = [];

    if (start > 1) {
      result.push(1);
      if (start > 2) result.push("ellipsis-left");
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) result.push("ellipsis-right");
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages, windowSize]);

  if (!totalPages || totalPages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    if (p === currentPage) return;
    onPageChange(p);
  };

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="board-pagination">
      <button
        className="page-btn nav"
        onClick={() => goTo(currentPage - 1)}
        disabled={!canPrev}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map((p) => {
        if (typeof p === "string" && p.startsWith("ellipsis")) {
          return (
            <span key={p} className="page-ellipsis">
              …
            </span>
          );
        }

        return (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`page-btn ${currentPage === p ? "active" : ""}`}
          >
            {p}
          </button>
        );
      })}

      <button
        className="page-btn nav"
        onClick={() => goTo(currentPage + 1)}
        disabled={!canNext}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </div>
  );
}
