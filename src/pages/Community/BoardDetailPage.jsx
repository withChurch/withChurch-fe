// src/pages/Community/BoardDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";
import { useAuth } from "../../contexts/AuthContext";


const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comments, addComment, setComments, loadPosts } = useBoard();

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
        
        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "익명",
          writerId: null, // API 응답에 없음
          writerName: postData.UserName,
          boardId: postData.boardId,
        };
        
        setPost(formattedPost);
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

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addComment(postId, commentText, "자유게시판");
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 자유게시판"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.files || []}
        onBack={() => navigate("/community/board")}
        onEdit={
          user && user.name === post.writerName
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
        onUpdate={(commentId, newText) => {
          const updated = existingComments.map((c) =>
            c.id === commentId ? { ...c, content: newText } : c
          );
          setComments(prev => ({
            ...prev,
            [postId]: updated
          }));
        }}
        onDelete={(commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          const filtered = existingComments.filter(c => c.id !== commentId);

          setComments(prev => ({
            ...prev,
            [postId]: filtered
          }));
        }}
      />
 
    </div>
  );
};

export default BoardDetailPage;
