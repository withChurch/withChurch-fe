// src/pages/Sermon/SundaySermonEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/skeleton/LoadingSpinner"

export default function SundaySermonEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost, deletePost } = useBoard();

  const postId = Number(id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await boardAPI.getPost(postId);

        // data.data 또는 data 둘 다 대응
        const postData = response?.data?.data ?? response?.data;

        if (!postData) {
          throw new Error("게시글 데이터가 없습니다.");
        }

        const formattedAttachments = (postData.attachments || postData.files || []).map((att) => ({
          id: att.attachmentId ?? att.id,
          attachmentId: att.attachmentId ?? att.id,
          name: att.fileName ?? att.name,
          fileName: att.fileName ?? att.name,
          size: att.fileSize ?? att.size,
          fileSize: att.fileSize ?? att.size,
          path: att.filePath ?? att.path,
          filePath: att.filePath ?? att.path,
        }));

        const rawImages = postData.images || postData.imageIds || [];
        const formattedImages = rawImages.map((img) => ({
          id: img?.id ?? img?.imageId ?? img,
          url: img?.imageUrl ?? img?.url ?? "",
        }));

        const formattedPost = {
          id: postData.postId ?? postData.id,
          title: postData.title ?? postData.postTitle ?? "",
          content: postData.content ?? postData.body ?? "",
          date: postData.createdAt
            ? String(postData.createdAt).split("T")[0]
            : "",
          views: postData.viewCount ?? 0,
          author:
            postData.UserName ??
            postData.userName ??
            postData.writerName ??
            "익명",
          writerName:
            postData.UserName ??
            postData.userName ??
            postData.writerName,
          writerId: postData.userId ?? postData.writerId,
          boardId: postData.boardId,
          attachments: formattedAttachments,
          images: formattedImages,
        };

        setPost(formattedPost);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        setPost(null);
        alert("게시글 정보를 가져오지 못했습니다.");
        navigate("/sermon/sunday");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate]);

  const handleSubmit = async ({
    title,
    content,
    files = [],
    images = [],
  }) => {
    try {
      await updatePost(postId, {
        title,
        content,
        files,
        imageIds: images,
        category: "주일예배",
      });

      navigate(`/sermon/sunday/${postId}`);
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePost(postId);
        navigate("/sermon/sunday");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  if (loading) return <LoadingSpinner />; 
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <Header
        breadcrumb="◦ 주일예배 > 글수정"
        title="주일예배 수정"
      />

      <PostForm
        showHeader={false}
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.attachments || []}
        initialImages={post.images || []}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/sermon/sunday/${postId}`)}
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
          <Trash2
            size={17}
            strokeWidth={1.2}
            style={{ verticalAlign: "middle" }}
          />
        </button>
      </div>
    </div>
  );
}