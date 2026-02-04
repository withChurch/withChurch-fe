// src/pages/Sermon/DawnSermonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";
import { useAuth } from "../../contexts/AuthContext";
import * as boardAPI from "../../api/boardAPI";
import * as commentAPI from "../../api/commentAPI";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const DawnSermonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    dawnComments, 
    loadDawnCommentsByPost, 
    addDawnComment 
  } = useBoard();

  const postId = Number(id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = dawnComments[postId] || [];

  const { user } = useAuth();

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

        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "관리자",
          writerId: postData.userId,
          writerName: postData.UserName,
          boardId: postData.boardId,
          attachments: formattedAttachments,
        };
        
        setPost(formattedPost);
        
        await loadDawnCommentsByPost(postId);
      } catch (error) {
        console.error("새벽예배 게시글 불러오기 실패:", error);
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
          <div className="title-text">해당 설교를 찾을 수 없습니다.</div>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/sermon/dawn")}
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
      await addDawnComment(postId, commentText, "새벽예배");
      setCommentText("");
      setIsWriting(false);
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 생명의 말씀 > 새벽예배"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.attachments || []}
        onBack={() => navigate("/sermon/dawn")}
        onEdit={
          user && (
            (user.userId !== 0 && Number(user.userId) === Number(post.writerId)) ||
            user.role === "ADMIN"
          )
            ? () => navigate(`/sermon/dawn/edit/${postId}`)
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
        loading={false}
        onUpdate={async (commentId, newText) => {
          try {
            await commentAPI.updateComment(commentId, { content: newText });
            await loadDawnCommentsByPost(postId);
          } catch (error) {
            alert("댓글 수정에 실패했습니다.");
          }
        }}
        onDelete={async (commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          try {
            await commentAPI.deleteComment(commentId);
            await loadDawnCommentsByPost(postId);
          } catch (error) {
            alert("댓글 삭제에 실패했습니다.");
          }
        }}
      />
    </div>
  );
};

export default DawnSermonPage;