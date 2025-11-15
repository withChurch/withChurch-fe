// src/pages/News/NoticeEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";
import { Trash2 } from "lucide-react";

export default function NoticeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { noticePosts, updateNoticePost, deleteNoticePost } = useBoard();

  const postId = Number(id);
  const post = noticePosts.find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ title, content }) => {
    updateNoticePost(postId, { title, content });
    navigate(`/news/notices/${postId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteNoticePost(postId);
      navigate("/news/notices");
    }
  };

  return (
    <div>
      <PostForm
        breadcrumb="◦ 교회소식 > 공지사항 > 글수정"
        pageTitle="공지사항 수정"
        initialTitle={post.title}
        initialContent={post.content}
        onSubmit={(data) => {
          updateNoticePost(postId, data);
          navigate(`/news/notices/${postId}`);
        }}
        onCancel={() => navigate(`/news/notices/${postId}`)}
      />

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          className="delete-btn"
          style={{
            background: "#ff7474",
            border: "none",
            outline: "1px dashed #ccc",
            padding: "8px 40px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500,
            margin: "20px auto 100px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ff6a6a";
            e.currentTarget.style.outlineColor = "#aaa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ff7474";
            e.currentTarget.style.outlineColor = "#ccc";
          }}
          onClick={handleDelete}
        >
          삭제
          <Trash2 size={17} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
}
