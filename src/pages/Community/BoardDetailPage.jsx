import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetailPage.css";
import { Paperclip } from "lucide-react";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = {
    title: "주일예배 ###번 내용에 오타가 있습니다.",
    date: "2025-11-01",
    content: `11-01에 올라가 있는 ###번 주일예배에
###로 오타가 있습니다.
수정 가능하다면 수정해서 올려 놓으면 좋겠습니다.`,
    file: "######",
  };

  const comments = [
    {
      author: "박시현",
      date: "2025-11-01",
      content: "감사합니다. 빨리 수정하도록 하겠습니다.",
    },
  ];

  return (
    <div className="detail-page">

      {/* 경로 */}
      <div className="detail-breadcrumb">
        <span>◦ 소통과 공감 &gt; 자유게시판</span>
      </div>

      {/* 제목 영역 */}
      <div className="detail-title-box">
        <div className="title-text">{post.title}</div>
        <div className="title-date">{post.date}</div>
      </div>

      <div className="detail-divider"></div>

      {/* 본문 */}
      <pre className="detail-content">{post.content}</pre>

      {/* 첨부파일 */}
      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>

        <div className="file-value-cell">
          <Paperclip size={18} className="file-icon" />
          <span className="file-name">{post.file}</span>
        </div>
      </div>



      {/* 버튼 */}
      <div className="detail-button-wrap">
        <button className="back-btn" onClick={() => navigate("/community/board")}>
          목록
        </button>
      </div>

      {/* 댓글 */}
      <div className="comment-title">댓글</div>

      <div className="comment-list">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.date}</span>
            </div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetailPage;
