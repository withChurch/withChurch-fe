// src/pages/Community/BoardDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";
import * as commentAPI from "../../api/commentAPI";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";
import { useAuth } from "../../contexts/AuthContext";


const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comments, commentsLoading, loadCommentsByPost, addComment, updateComment, deleteComment } = useBoard();

  const postId = Number(id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = comments[postId] || [];

  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await boardAPI.getPost(postId);
        const postData = response.data.data;
        
        // 첨부파일을 PostDetail 컴포넌트 형식에 맞게 변환
        const formattedAttachments = (postData.attachments || []).map((att) => ({
          id: att.attachmentId,
          name: att.fileName,
          size: att.fileSize,
          path: att.filePath,
        }));

        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "익명",
          writerId: postData.userId, // API 응답에서 userId 사용
          writerName: postData.UserName,
          boardId: postData.boardId,
          attachments: formattedAttachments,
        };
        
        setPost(formattedPost);
        
        // 게시글 로드 후 댓글도 불러오기
        await loadCommentsByPost(postId);
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

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/community/board")}
        >
          목록
        </button>
      </div>
    );
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    try {
      await addComment(postId, commentText, "자유게시판");
      setCommentText("");
      setIsWriting(false);
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 자유게시판"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.attachments || []}
        onBack={() => navigate("/community/board")}
        onEdit={
          user && (user.id === post.writerId || user.name === post.writerName)
            ? () => navigate(`/community/board/edit/${postId}`)
            : null
        }
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmitComment}
          onCancel={() => setIsWriting(false)}
        />
      )}

      <CommentList
        comments={existingComments}
        loading={commentsLoading}
        onUpdate={async (commentId, newText) => {
          try {
            await updateComment(postId, commentId, newText);
          } catch (error) {
            alert("댓글 수정에 실패했습니다.");
          }
        }}
        onDelete={async (commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          try {
            await deleteComment(postId, commentId);
          } catch (error) {
            alert("댓글 삭제에 실패했습니다.");
          }
        }}
      />
 
    </div>
  );
};

export default BoardDetailPage;
