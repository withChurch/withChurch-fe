// src/pages/News/UpdateDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../components/board/PostDetail.css";
import { useAuth } from "../../contexts/AuthContext";
import * as boardAPI from "../../api/boardAPI"; 
import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const UpdateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인 유저 정보

  const {
    // updatePosts 리스트에서 찾는 것 제거
    increaseUpdateViews,
    updateComments,
    addUpdateComment,
    setUpdateComments,
  } = useBoard();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = updateComments[postId] || [];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await boardAPI.getPost(postId);
        const postData = response.data.data;

        // 첨부파일 포맷팅
        const formattedAttachments = (postData.attachments || []).map((att) => ({
          id: att.attachmentId,
          attachmentId: att.attachmentId,
          name: att.fileName,
          fileName: att.fileName,
          size: att.fileSize,
          fileSize: att.fileSize,
          path: att.filePath,
        }));

        // 데이터 포맷팅
        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "관리자",
          writerId: postData.userId, // 작성자 ID (수정 버튼용)
          files: formattedAttachments,
        };

        setPost(formattedPost);
        
        // 조회수 증가 (API 호출이 성공했을 때만)
        increaseUpdateViews(postId);

      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // ▼ 로딩 중 화면
  if (loading) {
    return <div className="detail-page"><div className="detail-title-box">로딩 중...</div></div>;
  }

  // ▼ 게시글 없을 때 화면
  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button className="back-btn" onClick={() => navigate("/news/updates")}>
          목록
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addUpdateComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 교회 소식 > 교회소식"
        title={post.title}
        date={post.date}
        content={post.content}
        files={post.files || []}
        onBack={() => navigate("/news/updates")}
        
        // ▼ 수정 버튼 조건 (관리자 권한 확인)
        onEdit={
            user &&
            (
              user.role === "ADMIN" || 
              (post.writerId && Number(user.userId) === Number(post.writerId))
            )
              ? () => navigate(`/news/updates/edit/${postId}`)
              : null
          }
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setIsWriting(false)}
        />
      )}

      <CommentList
        comments={existingComments}
        onUpdate={(commentId, newText) => {
          const updated = existingComments.map((c) =>
            c.id === commentId ? { ...c, content: newText } : c
          );
          setUpdateComments((prev) => ({
            ...prev,
            [postId]: updated,
          }));
        }}
        onDelete={(commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          const filtered = existingComments.filter((c) => c.id !== commentId);
          setUpdateComments((prev) => ({
            ...prev,
            [postId]: filtered,
          }));
        }}
      />
    </div>
  );
};

export default UpdateDetailPage;