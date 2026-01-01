// src/pages/Community/PrayerDetailPage.jsx
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

const PrayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    prayerComments,
    prayerCommentsLoading,
    loadPrayerCommentsByPost,
    addPrayerComment,
    updatePrayerComment,
    deletePrayerComment,
  } = useBoard();

  const postId = Number(id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = prayerComments[postId] || [];

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
          author: postData.UserName || "익명",
          writerName: postData.UserName,
          boardId: postData.boardId,
          attachments: formattedAttachments,
        };
        
        setPost(formattedPost);
        
        // 게시글 로드 후 댓글도 불러오기
        await loadPrayerCommentsByPost(postId);
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
          onClick={() => navigate("/community/prayer")}
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
      await addPrayerComment(postId, commentText, "중보기도");
      setCommentText("");
      setIsWriting(false);
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 중보기도"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.attachments || []}        
        onEdit={() => navigate(`/community/prayer/edit/${postId}`)} 
        onBack={() => navigate("/community/prayer")}
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
        loading={prayerCommentsLoading}
        onUpdate={async (commentId, newText) => {
          try {
            await updatePrayerComment(postId, commentId, newText);
          } catch (error) {
            alert("댓글 수정에 실패했습니다.");
          }
        }}
        onDelete={async (commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          try {
            await deletePrayerComment(postId, commentId);
          } catch (error) {
            alert("댓글 삭제에 실패했습니다.");
          }
        }}
      />

    </div>
  );
};

export default PrayerDetailPage;
