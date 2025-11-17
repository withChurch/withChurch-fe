// src/pages/Community/PrayerEditPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";
import { Trash2 } from "lucide-react";

export default function PrayerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prayerPosts, updatePrayerPost, deletePrayerPost } = useBoard();

  const postId = Number(id);
  const post = prayerPosts.find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = ({ title, content }) => {
    updatePrayerPost(postId, { title, content });
    navigate(`/community/prayer/${postId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePrayerPost(postId);
      navigate("/community/prayer");
    }
  };

  return (
    <div>
      <PostForm
        breadcrumb="◦ 소통과 공감 > 중보기도 > 글수정"
        pageTitle="게시글 수정"
        initialTitle={post.title}
        initialContent={post.content}
        onSubmit={(data) => {
          updatePrayerPost(postId, data);
          navigate(`/community/prayer/${postId}`);
        }}
        onCancel={() => navigate(`/community/prayer/${postId}`)}
      />

      {/* 삭제버튼 */}
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
          <Trash2 size={17} strokeWidth={1.2} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </div>
  );
}
