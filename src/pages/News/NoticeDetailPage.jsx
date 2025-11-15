// src/pages/News/NoticeDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./../Community/BoardDetailPage.css";
import { Paperclip } from "lucide-react";
import { useBoard } from "../../contexts/BoardContext";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    noticePosts,
    increaseNoticeViews,
    noticeComments,
    addNoticeComment,
  } = useBoard();

  const postId = Number(id);
  const post = noticePosts.find((p) => p.id === postId);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Updates 상단 공지에서 온 경우
  const fromUpdatesTop = location.state?.from === "updates-top";

  const comments = noticeComments[postId] || [];

  useEffect(() => {
    if (post) {
      increaseNoticeViews(post.id);
    }
  }, []);

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">
            해당 게시글을 찾을 수 없습니다.
          </div>
        </div>
        <button
          className="back-btn"
          onClick={() =>
            navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
          }
        >
          목록
        </button>
      </div>
    );
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addNoticeComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <span>◦ 교회 소식 &gt; 공지사항</span>
      </div>

      <div className="detail-title-box">
        <div className="title-text">{post.title}</div>
        <div className="title-date">{post.date}</div>
      </div>

      <div className="detail-divider" />

      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="detail-file-table">
        <div className="file-label-cell">첨부파일</div>
        <div className="file-value-cell">
          <Paperclip size={18} className="file-icon" />
          <span className="file-name">{post.file}</span>
        </div>
      </div>

      <div className="detail-button-wrap">
        <button
          className="back-btn"
          onClick={() =>
            navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
          }
        >
          목록
        </button>
      </div>

      <div className="comment-header-row">
        <div className="comment-header-title">댓글</div>

        <button
          className="comment-write-toggle"
          onClick={() => setIsWriting(true)}
        >
          댓글쓰기 ✎
        </button>
      </div>

      {/* 댓글쓰는박스 */}
      {isWriting && (
        <div className="comment-write-box">
          <div className="comment-write-info">
            <span className="cw-author">익명</span>
            <span className="cw-date">
              {new Date().toISOString().split("T")[0]}
            </span>
          </div>

          <textarea
            className="comment-textarea"
            placeholder="내용을 입력하세요."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <div className="comment-write-btn-row">
            <button className="cw-submit" onClick={handleSubmitComment}>
              등록
            </button>
            <button
              className="cw-cancel"
              onClick={() => setIsWriting(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 댓글 리스트 */}
      <div className="comment-list-box">
        {comments.length === 0 ? (
          <div className="no-comment">등록된 댓글이 없습니다.</div>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{c.date}</span>
              </div>
              <div className="comment-content">{c.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeDetailPage;
