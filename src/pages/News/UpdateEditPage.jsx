// src/pages/News/UpdateEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI"; 
import { Trash2 } from "lucide-react";

export default function UpdateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUpdatePost, deleteUpdatePost } = useBoard();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await boardAPI.getPost(postId);
        const postData = response?.data?.data ?? response?.data ?? null;

        if (!postData) {
          if (alive) setPost(null);
          return;
        }

        const formattedAttachments = (postData.attachments || postData.files || []).map(
          (att) => ({
            id: att.attachmentId ?? att.id,
            attachmentId: att.attachmentId ?? att.id,
            name: att.fileName ?? att.name,
            fileName: att.fileName ?? att.name,
            size: att.fileSize ?? att.size,
            fileSize: att.fileSize ?? att.size,
            path: att.filePath ?? att.path,
            filePath: att.filePath ?? att.path,
          })
        );

        const rawImages = postData.images || postData.imageIds || [];
        const formattedImages = rawImages.map((img) => ({
          id: img?.id ?? img?.imageId ?? img,
          url: img?.imageUrl ?? img?.url ?? "",
        }));

        const formattedPost = {
          id: postData.postId ?? postData.updateId ?? postData.id ?? postId,
          title: postData.title ?? "",
          content: postData.content ?? "",
          attachments: formattedAttachments,
          images: formattedImages,
        };

        if (alive) setPost(formattedPost);
      } catch (error) {
        console.error("교회소식 게시글 불러오기 실패:", error);
        if (alive) setPost(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (!Number.isNaN(postId) && postId > 0) {
      fetchPost();
    } else {
      setLoading(false);
      setPost(null);
    }

    return () => {
      alive = false;
    };
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = async ({ title, content, files = [], images = [] }) => {
    try {
      await updateUpdatePost(postId, {
        title,
        content,
        files,
        imageIds: images,
      });

      navigate(`/news/updates/${postId}`);
    } catch (error) {
      alert("교회소식 게시글 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteUpdatePost(postId);
        navigate("/news/updates");
      } catch (error) {
        alert("교회소식 게시글 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header breadcrumb="◦ 교회소식 > 글수정" title="교회소식 수정" />

      <PostForm
        showHeader={false}
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.attachments || []}
        initialImages={post.images || []}
        onSubmit={handleSubmit}
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
          <Trash2 size={17} strokeWidth={1.2} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </div>
  );
}