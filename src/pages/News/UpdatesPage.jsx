// src/pages/News/UpdatesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Pagination from "../../components/board/Pagination";
import { useBoard } from "../../contexts/BoardContext";
import SearchBar from "../../components/common/SearchBar";
import { useAuth } from "../../contexts/AuthContext";

export default function UpdatesPage() {
  const navigate = useNavigate();
  const { noticePosts, updatePosts } = useBoard();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const sortedNotices = [...noticePosts].sort((a, b) => b.id - a.id);
  const topNotices = sortedNotices.slice(0, 2);
  const noticeCount = topNotices.length;

  const { user } = useAuth();
  
  const filteredUpdates = updatePosts.filter((p) => {
    if (!keyword.trim()) return true;
    const lower = keyword.toLowerCase();

    const target =
      searchType === "title"
        ? p.title
        : (p.content || "");

    return target.toLowerCase().includes(lower);
  });

  const sortedUpdates = [...filteredUpdates].sort((a, b) => b.id - a.id);
  const totalUpdates = sortedUpdates.length;

  const perPage = 10;

  const firstPageUpdateCap = Math.max(0, perPage - noticeCount);

  let totalPages = 1;
  if (totalUpdates > firstPageUpdateCap) {
    const remaining = totalUpdates - firstPageUpdateCap;
    const extraPages = Math.ceil(remaining / perPage);
    totalPages = 1 + extraPages;
  }

  let pageUpdates = [];
  let startIndexForNumbering = 0;

  if (currentPage === 1) {
    pageUpdates = sortedUpdates.slice(0, firstPageUpdateCap);
    startIndexForNumbering = 0;
  } else {
    const pageIndex = currentPage - 2; 
    const start = firstPageUpdateCap + pageIndex * perPage;
    const end = start + perPage;
    pageUpdates = sortedUpdates.slice(start, end);
    startIndexForNumbering = start;
  }

  const numberedUpdates = pageUpdates.map((post, idx) => {
    const globalIndex = startIndexForNumbering + idx;
    const number = totalUpdates - globalIndex;
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

  return (
    <div className="board-wrapper">
      <div className="board-page">

        <div className="board-breadcrumb">
          <Home
            size={15}
            style={{
              verticalAlign: "middle",
              marginRight: 6,
              marginBottom: 2,
            }}
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
            marginBottom: 0,
          }}
        >

        <SearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          keyword={keyword}
          setKeyword={setKeyword}
          setCurrentPage={setCurrentPage}
        />

          {user?.role === "ADMIN" && (
          <button
            className="board-write-btn"
            onClick={() => navigate("/news/updates/write")}
          >
            글쓰기 ✎
          </button>
        )}
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

              {currentPage === 1 &&
                topNotices.map((n) => (
                  <tr
                    key={`notice-${n.id}`}
                    onClick={() => handleNoticeClick(n.id)}
                  >
                    <td className="col-no">
                      <span
                        style={{
                          backgroundColor: "#4E6B93",
                          opacity: 0.95,
                          color: "white",
                          padding: "3.3px 9px",
                          borderRadius: "4px",
                          fontSize: "12.6px",
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
                <tr key={p.id} onClick={() => handleUpdateClick(p.id)}>
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
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
}
