// src/pages/Community/BoardEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import Header from "../../components/common/Header";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";
import { Trash2 } from "lucide-react";

export default function BoardEditPage() {
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
        const postData = response.data.data;
        
        // 첨부파일을 PostForm 형식에 맞게 변환
        const formattedAttachments = (postData.attachments || []).map((att) => ({
          id: att.attachmentId,
          attachmentId: att.attachmentId,
          name: att.fileName,
          fileName: att.fileName,
          size: att.fileSize,
          fileSize: att.fileSize,
          path: att.filePath,
          filePath: att.filePath,
        }));

        const rawImages = postData.images || postData.imageIds || [];
        const formattedImages = rawImages.map(img => ({
            id: img.id || img.imageId || img, // img가 객체면 id 추출, 숫자/문자열이면 그대로
            url: img.imageUrl || img.url || "" 
        }));

        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "익명",
          writerName: postData.UserName,
          writerId: postData.userId,
          boardId: postData.boardId,
          attachments: formattedAttachments,
          images: formattedImages,
        };
        
        setPost(formattedPost);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handleSubmit = async ({ title, content, files = [], images = [] }) => {
    try {
      await updatePost(postId, { 
          title, 
          content, 
          files, 
          imageIds: images
      });
      
      navigate(`/community/board/${postId}`);
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePost(postId);
        navigate("/community/board");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header
        breadcrumb="◦ 자유게시판 > 글수정"
        title="게시글 수정"
      />
      <PostForm
        showHeader={false}
        initialTitle={post.title}
        initialContent={post.content}
        initialFiles={post.attachments || []}
        initialImages={post.images || []}
        onSubmit={handleSubmit}
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
