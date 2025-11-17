// src/pages/Community/BoardEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";
import { Trash2 } from "lucide-react";

export default function BoardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, updatePost, deletePost } = useBoard();

  const postId = Number(id);
  const post = posts.find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ title, content }) => {
    updatePost(postId, { title, content });
    navigate(`/community/board/${postId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost(postId);
      navigate("/community/board");
    }
  };

  return (
    <div>
      <PostForm
        breadcrumb="◦ 소통과 공감 > 자유게시판 > 글수정"
        pageTitle="게시글 수정"
        initialTitle={post.title}
        initialContent={post.content}
        onSubmit={(data) => {
          updatePost(postId, data);
          navigate(`/community/board/${postId}`);
        }}        
        onCancel={() => navigate(`/community/board/${postId}`)}
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
          <Trash2 size={17} strokeWidth={1.2} style={{ verticalAlign: "middle" }}/>
        </button>
      </div>

    </div>
  );
}
