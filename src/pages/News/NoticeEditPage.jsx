// src/pages/News/NoticeEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/skeleton/LoadingSpinner"

export default function NoticeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateNoticePost, deleteNoticePost } = useBoard();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatAttachments = (raw = []) =>
    (raw || []).map((att) => {
      const attachmentId = att?.attachmentId ?? att?.id ?? att?.fileId;
      const fileName = att?.fileName ?? att?.name ?? "";
      const fileSize = att?.fileSize ?? att?.size ?? 0;
      const filePath = att?.filePath ?? att?.path ?? "";

      return {
        id: attachmentId ?? fileName, // fallback
        attachmentId,
        name: fileName,
        fileName,
        size: fileSize,
        fileSize,
        path: filePath,
        filePath,
      };
    });

  const formatImages = (raw = []) =>
    (raw || []).map((img) => ({
      id: img?.id ?? img?.imageId ?? img,
      url: img?.imageUrl ?? img?.url ?? "",
    }));

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);

        const getFn =
          boardAPI.getNoticePost || boardAPI.getNotice || boardAPI.getPost;

        const response = await getFn(postId);

        // 보통 response.data.data 형태라서 BoardEditPage와 동일하게 처리
        const postData = response?.data?.data ?? response?.data ?? null;

        if (!postData) {
          setPost(null);
          return;
        }

        const formattedPost = {
          id: postData.noticeId ?? postData.postId ?? postData.id,
          title: postData.title ?? "",
          content: postData.content ?? "",
          attachments: formatAttachments(
            postData.attachments || postData.files || []
          ),
          images: formatImages(postData.images || postData.imageIds || []),
        };

        setPost(formattedPost);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchNotice();
  }, [postId]);

  if (loading) return <LoadingSpinner />; 
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = async ({ title, content, files = [], images = [] }) => {
    try {
      await updateNoticePost(postId, {
        title,
        content,
        files,
        imageIds: images,
      });

      navigate(`/news/notices/${postId}`);
    } catch (error) {
      alert("공지사항 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteNoticePost(postId);
        navigate("/news/notices");
      } catch (error) {
        alert("공지사항 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header breadcrumb="◦ 공지사항 > 글수정" title="공지사항 수정" />

      <PostForm
        key={postId}
        showHeader={false}
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.attachments || []}
        initialImages={post.images || []}
        onSubmit={handleSubmit}
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
          <Trash2 size={17} strokeWidth={1.2} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </div>
  );
}