import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Pagination from "../../components/board/Pagination";

export default function NoticesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const notices = [
    { id: 6, title: "교회 셔틀버스 운영안내", date: "2025-11-08", views: 67 },
    { id: 5, title: "With Church 유튜브 (You Tube) 구독 방법", date: "2025-11-02", views: 101 },
    { id: 4, title: "학습 / 세례 / 입교식 예고", date: "2025-11-01", views: 128 },
    { id: 3, title: "추수감사절 예배안내", date: "2025-10-26", views: 145 },
    { id: 2, title: "2025년 10월 26일 연합예배안내", date: "2025-10-25", views: 210 },
    { id: 1, title: "유아세례식 예고", date: "2025-10-19", views: 223 },
  ];

  const handleClick = (id) => {
    navigate(`/news/notices/${id}`);
  };

  const handlePageChange = (num) => {
    setCurrentPage(num);
  };

  const handleSearch = () => {
    console.log("검색 실행:", searchType, keyword);
  };

  return (
    <div className="board-page">

      <div className="board-breadcrumb">
        <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
        <span>&gt; 교회소식 &gt; 공지사항</span>
      </div>

      <h1 className="board-title">공지사항</h1>

      <div
        className="board-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "250px",
              fontSize: "14px",
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "7px 10px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <Search size={18} />
          </button>
        </div>

        <button
          className="board-write-btn"
          onClick={() => navigate("/news/notices/write")}
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
            {notices.map((n) => (
              <tr key={n.id} onClick={() => handleClick(n.id)}>
                <td className="col-no">{n.id}</td>
                <td className="col-title">{n.title}</td>
                <td className="col-date">{n.date}</td>
                <td className="col-views">{n.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={4}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
