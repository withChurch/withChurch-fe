// src/pages/Community/PrayerEditPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";
import { Trash2 } from "lucide-react";

export default function PrayerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prayerPosts, updatePrayerPost, deletePrayerPost } = useBoard();

  const postId = useMemo(() => Number(id), [id]);
  const isValidId = Number.isFinite(postId);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isValidId) {
      setPost(null);
      setLoading(false);
      return;
    }

    const cached = (prayerPosts || []).find(
      (p) => Number(p.id ?? p.postId) === postId
    );

    const normalizeFiles = (arr = []) =>
      (arr || []).map((f) => ({
        id: f.id ?? f.attachmentId ?? f.fileId,
        attachmentId: f.attachmentId ?? f.id ?? f.fileId,
        name: f.name ?? f.fileName ?? "",
        fileName: f.fileName ?? f.name ?? "",
        size: f.size ?? f.fileSize ?? 0,
        fileSize: f.fileSize ?? f.size ?? 0,
        path: f.path ?? f.filePath ?? "",
        filePath: f.filePath ?? f.path ?? "",
      }));

    const normalizeImages = (arr = []) =>
      (arr || []).map((img) => ({
        id: img.id ?? img.imageId ?? img,
        url: img.imageUrl ?? img.url ?? "",
      }));

    const setFromCached = () => {
      if (!cached) return;

      setPost({
        id: cached.id ?? cached.postId ?? postId,
        title: cached.title ?? "",
        content: cached.content ?? cached.contents ?? cached.body ?? "",
        files: normalizeFiles(cached.files ?? cached.attachments ?? []),
        images: normalizeImages(cached.images ?? cached.imageIds ?? []),
      });
    };

    const fetchPost = async () => {
      try {
        setLoading(true);

        const getDetail =
          boardAPI.getPrayerPost ||
          boardAPI.getPrayerDetail ||
          boardAPI.getPost;

        const response = await getDetail(postId);
        const postData = response?.data?.data ?? response?.data ?? {};

        const formattedAttachments = normalizeFiles(
          postData.attachments ?? postData.files ?? []
        );

        const rawImages = postData.images ?? postData.imageIds ?? [];
        const formattedImages = normalizeImages(rawImages);

        setPost({
          id: postData.postId ?? postData.id ?? postId,
          title: postData.title ?? "",
          content: postData.content ?? postData.contents ?? postData.body ?? "",
          files: formattedAttachments,
          images: formattedImages,
        });
      } catch (error) {
        console.error("중보기도 게시글 불러오기 실패:", error);
        setFromCached();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isValidId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = async ({ title, content, files = [], images = [] }) => {
    try {
      await updatePrayerPost(postId, {
        title,
        content,
        files,
        imageIds: images,
      });

      navigate(`/community/prayer/${postId}`);
    } catch (error) {
      alert("중보기도 게시글 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePrayerPost(postId);
        navigate("/community/prayer");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header breadcrumb="◦ 중보기도 > 글수정" title="중보기도 수정" />

      <PostForm
        showHeader={false}
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.files || []}
        initialImages={post.images || []}
        onSubmit={handleSubmit}
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