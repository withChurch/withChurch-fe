// src/pages/News/UpdatesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import { useBoard } from "../../contexts/BoardContext";

export default function UpdatesPage() {
  const navigate = useNavigate();
  const { noticePosts, updatePosts } = useBoard();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  // 공지사항에서 최신 순 2개 뽑기 (상단 고정용)
  const sortedNotices = [...noticePosts].sort((a, b) => b.id - a.id);
  const topNotices = sortedNotices.slice(0, 2);
  const noticeCount = topNotices.length;

  const filteredUpdates = updatePosts.filter((p) => {
    if (!keyword.trim()) return true;
    const lower = keyword.toLowerCase();
    if (searchType === "title") {
      return p.title.toLowerCase().includes(lower);
    }
    if (searchType === "content") {
      return (p.content || "").toLowerCase().includes(lower);
    }
    return true;
  });

  const sortedUpdates = [...filteredUpdates].sort((a, b) => b.id - a.id);
  const totalUpdates = sortedUpdates.length;

  const perPage = 6;

  // 1페이지에서 일반 글이 차지할 수 있는 칸 수=4개임
  const firstPageUpdateCap = Math.max(0, perPage - noticeCount);

  let totalPages = 1;
  if (totalUpdates > firstPageUpdateCap) {
    const remaining = totalUpdates - firstPageUpdateCap;
    const extraPages = Math.ceil(remaining / perPage);
    totalPages = 1 + extraPages;
  } else {
    totalPages = 1; // 글이 적으면 1페이지만
  }

  // 현재 페이지에 보여줄 업데이트 글 slice
  let pageUpdates = [];
  let startIndexForNumbering = 0; // 전체 updates 중에서 이 페이지의 첫 글 인덱스

  if (currentPage === 1) {
    // 1페이지: 상단 공지 2개 + 일반글 firstPageUpdateCap개
    pageUpdates = sortedUpdates.slice(0, firstPageUpdateCap);
    startIndexForNumbering = 0;
  } else {
    // 2페이지 이상: 공지 없고 순수 updates만 perPage개씩
    const pageIndex = currentPage - 2; // 0부터
    const start = firstPageUpdateCap + pageIndex * perPage;
    const end = start + perPage;
    pageUpdates = sortedUpdates.slice(start, end);
    startIndexForNumbering = start;
  }

  // 번호 부여 (updates용 번호, 상단공지만 "공지" 배지)
  const numberedUpdates = pageUpdates.map((post, idx) => {
    const globalIndex = startIndexForNumbering + idx; // sortedUpdates 기준 index
    const number = totalUpdates - globalIndex; // 전체 업데이트 글 수 기준 역순 번호
    return { ...post, number };
  });

  const handleNoticeClick = (id) => {
    navigate(`/news/notices/${id}`, {
      state: { from: "updates-top" },
    });
  };

  const handleUpdateClick = (id) => {
    navigate(`/news/updates/${id}`);
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
  };

  return (
    <div className="board-wrapper">
      <div className="board-page">
        <div className="board-breadcrumb">
          <Home
            size={18}
            style={{ verticalAlign: "middle", marginRight: 6 }}
          />
          <span>&gt; 교회소식 &gt; 교회소식</span>
        </div>

        <h1 className="board-title">교회소식</h1>

        <div
          className="board-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>

            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "250px",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "7px 10px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              <Search size={18} />
            </button>
          </div>

          <button
            className="board-write-btn"
            onClick={() => navigate("/news/updates/write")}
          >
            글쓰기 ✎
          </button>
        </div>

        <div className="board-table-container">
          <table className="board-table">
            <thead>
              <tr>
                <th className="col-no">번호</th>
                <th className="col-title">제목</th>
                <th className="col-date">등록일</th>
                <th className="col-views">조회수</th>
              </tr>
            </thead>
            <tbody>
              {/* 1페이지에서만 상단 공지 2개 */}
              {currentPage === 1 &&
                topNotices.map((n) => (
                  <tr
                    key={`notice-${n.id}`}
                    onClick={() => handleNoticeClick(n.id)}
                  >
                    <td className="col-no">
                      <span
                        style={{
                          backgroundColor: "#ff4d4d",
                          color: "white",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        공지
                      </span>
                    </td>
                    <td className="col-title">{n.title}</td>
                    <td className="col-date">{n.date}</td>
                    <td className="col-views">{n.views}</td>
                  </tr>
                ))}

              {numberedUpdates.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handleUpdateClick(p.id)}
                >
                  <td className="col-no">{p.number}</td>
                  <td className="col-title">{p.title}</td>
                  <td className="col-date">{p.date}</td>
                  <td className="col-views">{p.views}</td>
                </tr>
              ))}

              {topNotices.length === 0 && numberedUpdates.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "30px 0" }}>
                    등록된 교회소식이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
