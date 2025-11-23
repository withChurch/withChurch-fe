// src/pages/Auth/MyCommentsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyCommentsPage.css";
import { useBoard } from "../../contexts/BoardContext";

export default function MyCommentsPage() {
  const navigate = useNavigate();
  const user = { name: "익명" }; // TAB을 API로 교체

  const board = useBoard() ?? {};
  const {
    posts = [],
    prayerPosts = [],
    comments = [],
  } = board;

  const allComments = Object.entries(comments).flatMap(([postId, list]) =>
    list.map(c => ({ ...c, postId: Number(postId) }))
  );

  const myComments = allComments
    .filter((c) => c.author === user.name)
    .sort((a, b) => b.id - a.id);

  const categoryMap = {
    자유게시판: "/community/board",
    중보기도: "/community/prayer",
  };

  return (
    <div className="mycomments-wrapper">
      <h2 className="mycomments-title">내 댓글</h2>
      <p className="mycomments-sub">
        {user.name}님은 총 {myComments.length}개의 댓글을 작성하셨습니다.
      </p>

      <div className="mycomments-list">
        {myComments.length === 0 ? (
          <div className="mycomments-empty">작성한 댓글이 없습니다.</div>
        ) : (
          myComments.map((c) => (
            <div
              key={c.id}
              className="mycomments-item"
              onClick={() =>
                navigate(`${categoryMap[c.category]}/${c.postId}`)
              }
            >
              <div className="mycomments-category">{c.category}</div>
              <div className="mycomments-content">{c.content}</div>

              <div className="mycomments-meta">
                {c.date} · 해당 글 바로가기 →
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
