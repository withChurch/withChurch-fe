import React from "react";
import "./MyCommentsSkeleton.css";

function Sk({ className = "", style }) {
  return <span className={`mycomments-sk ${className}`} style={style} aria-hidden="true" />;
}

export default function MyCommentsSkeleton() {
  const cards = Array.from({ length: 6 }); // 화면에 보이는 만큼만(너무 많으면 답답해서 6개 추천)

  return (
    <div
      className="mycomments-wrapper mycomments-skeleton"
      role="status"
      aria-label="내 댓글을 불러오는 중입니다."
      aria-busy="true"
    >
      <h2 className="mycomments-title">내 댓글</h2>

      <p className="mycomments-sub">
        <Sk className="mycomments-sk-line" style={{ width: "280px", height: 14 }} />
      </p>

      {/* 필터 버튼 자리 */}
      <div className="mycomments-filter" aria-hidden="true">
        <Sk className="mycomments-sk-pill" style={{ width: 120 }} />
        <Sk className="mycomments-sk-pill" style={{ width: 108 }} />
        <Sk className="mycomments-sk-pill" style={{ width: 132 }} />
        <Sk className="mycomments-sk-pill" style={{ width: 96 }} />
        <Sk className="mycomments-sk-pill" style={{ width: 116 }} />
      </div>

      {/* 댓글 카드 자리 */}
      <div className="mycomments-list" aria-hidden="true">
        {cards.map((_, idx) => (
          <div key={idx} className="mycomments-item mycomments-skeleton-card">
            <Sk className="mycomments-sk-line-sm" style={{ width: "92px", marginBottom: 8 }} />
            <Sk className="mycomments-sk-line-lg" style={{ width: "92%", marginBottom: 8 }} />
            <Sk className="mycomments-sk-line-lg" style={{ width: "76%", marginBottom: 10 }} />
            <Sk className="mycomments-sk-line-sm" style={{ width: "170px" }} />
          </div>
        ))}
      </div>

      {/* 페이지네이션 자리 */}
      <div className="board-pagination mycomments-skeleton-pagination" aria-hidden="true">
        <Sk className="mycomments-sk-square" />
        <Sk className="mycomments-sk-square" />
        <Sk className="mycomments-sk-square" />
        <Sk className="mycomments-sk-square" />
        <Sk className="mycomments-sk-square" />
      </div>
    </div>
  );
}