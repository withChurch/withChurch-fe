// src/components/board/CommentList.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CommentList({
  comments = [],
  loading = false,
  onUpdate = () => {},
  onDelete = () => {},
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { user } = useAuth();

  if (loading) {
    return (
      <div className="comment-list-box">
        <div className="no-comment">댓글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="comment-list-box">
      {comments.length === 0 ? (
        <div className="no-comment">등록된 댓글이 없습니다.</div>
      ) : (
        comments.map((c) => {
          console.log("User 객체 전체 확인:", user);
          console.log("로그인한 내 ID:", user?.id, typeof user?.id);
          console.log("댓글 작성자 ID:", c.writerId, typeof c.writerId);
          console.log("일치 여부:", user?.id === c.writerId);
          console.log("댓글 데이터 전체:", c);

          return (
            <div key={c.id} className="comment-item">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="comment-header">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-date">{c.date}</span>
                </div>

                {user && (user.role === "ADMIN" || Number(user.userId) === Number(c.writerId)) && (
                  <div className="comment-actions">
                    {editingId === c.id ? (
                      <>
                        <button
                          className="comment-action-btn"
                          onClick={() => {
                            onUpdate(c.id, editText);
                            setEditingId(null);
                            setEditText("");
                          }}
                        >
                          완료
                        </button>
                        <button
                          className="comment-action-btn"
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="comment-action-btn"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditText(c.content);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="comment-action-btn"
                          onClick={() => onDelete(c.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingId === c.id ? (
                <textarea
                  className="comment-textarea"
                  style={{ marginTop: "12px" }}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <div className="comment-content">{c.content}</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}