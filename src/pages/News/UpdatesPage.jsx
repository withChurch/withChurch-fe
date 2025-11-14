import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Pagination from "../../components/board/Pagination";

export default function UpdatesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");

  const noticePosts = [
    { id: 6, title: "교회 셔틀버스 운영안내", date: "2025-11-08", views: 67 },
    { id: 5, title: "With Church 유튜브 (You Tube) 구독 방법", date: "2025-11-02", views: 101 },
  ];

  const posts = [
    { id: 4, title: "교회 중보 기도제목", date: "2025-10-26", views: 128 },
    { id: 3, title: "2025년 10월 19일 주일예배 주보", date: "2025-10-19", views: 145 },
    { id: 2, title: "2025년 10월 12일 주일예배 주보", date: "2025-10-12", views: 210 },
    { id: 1, title: "어린이 여름성경학교", date: "2025-08-17", views: 223 },
  ];

  const handleClick = (id, isNotice) => {
    if (isNotice) {
      // 상단 공지는 같은 공지 상세 페이지 state만 추가
      navigate(`/news/notices/${id}`, {
        state: { from: "updates-top" },
      });
    } else {

      navigate(`/news/updates/${id}`);
    }
  };

  const handlePageChange = (n) => {
    setCurrentPage(n);
  };

  return (
    <div className="board-page">

      <div className="board-breadcrumb">
        <Home size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
        <span>&gt; 교회소식 &gt; 교회소식</span>
      </div>

      <h1 className="board-title">교회소식</h1>

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
            onClick={() => console.log("검색:", searchType, keyword)}
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
            {noticePosts.map((n) => (
              <tr key={n.id} onClick={() => handleClick(n.id, true)}>
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

            {posts.map((p) => (
              <tr key={p.id} onClick={() => handleClick(p.id, false)}>
                <td className="col-no">{p.id}</td>
                <td className="col-title">{p.title}</td>
                <td className="col-date">{p.date}</td>
                <td className="col-views">{p.views}</td>
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
