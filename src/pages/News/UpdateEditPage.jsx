// src/pages/News/UpdateEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";
import { Trash2 } from "lucide-react";

export default function UpdateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePosts, updateUpdatePost, deleteUpdatePost } = useBoard();

  const postId = Number(id);
  const post = updatePosts.find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ title, content }) => {
    updateUpdatePost(postId, { title, content });
    navigate(`/news/updates/${postId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteUpdatePost(postId);
      navigate("/news/updates");
    }
  };

  return (
    <div>
      <PostForm
        breadcrumb="◦ 교회소식 > 교회소식 > 글수정"
        pageTitle="게시글 수정"
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.files || []}

        onSubmit={(data) => {
          updateUpdatePost(postId, data);
          navigate(`/news/updates/${postId}`);
        }}
        onCancel={() => navigate(`/news/updates/${postId}`)}
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
