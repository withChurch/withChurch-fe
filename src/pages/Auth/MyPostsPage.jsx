// src/pages/Auth/MyPostsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyPostsPage.css";

import { useBoard } from "../../contexts/BoardContext";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const user = { name: "TAB" }; //API교체필요

  const board = useBoard() ?? {};
  const {
    posts = [],
    prayerPosts = [],
  } = board;

  const categoryMap = {
    자유게시판: "/community/board",
    중보기도: "/community/prayer",
  };

  const myPosts = [
    ...posts.map((p) => ({ ...p, category: "자유게시판" })),
    ...prayerPosts.map((p) => ({ ...p, category: "중보기도" })),
  ]
    .filter((p) => p.author === user.name)
    .sort((a, b) => b.id - a.id); 

  return (
    <div className="myposts-wrapper">
      <h2 className="myposts-title">내 게시글</h2>
      <p className="myposts-sub">{user.name}님은 총 {myPosts.length}개의 게시글을 작성하셨습니다.</p>

      <div className="myposts-list">
        {myPosts.length === 0 ? (
          <div className="myposts-empty">작성한 글이 없습니다.</div>
        ) : (
          myPosts.map((post) => (
            <div
              key={post.id}
              className="myposts-item"
              onClick={() =>
                navigate(`${categoryMap[post.category]}/${post.id}`)
              }
            >
              <div className="myposts-category">{post.category}</div>

              <div className="myposts-title-row">
                <span className="myposts-post-title">{post.title}</span>
              </div>

              <div className="myposts-bottom">
                <span className="myposts-date">{post.date}</span>
                <span className="myposts-views">조회수 {post.views}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
