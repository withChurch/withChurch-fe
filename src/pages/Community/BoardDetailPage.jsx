import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";

import PostDetail from "../../components/board/PostDetail";
import PostDetailSkeleton from "../../components/skeleton/PostDetailSkeleton";

import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";
import { useAuth } from "../../contexts/AuthContext";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);

  const {
    comments,
    commentsLoading,
    loadCommentsByPost,
    addComment,
    updateComment,
    deleteComment,
  } = useBoard();

  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = comments[postId] || [];

  useEffect(() => {
    let alive = true;

    const fetchPost = async () => {
      setLoading(true);

      try {
        const response = await boardAPI.getPost(postId);
        const postData = response?.data?.data;

        if (!postData) {
          if (alive) setPost(null);
          return;
        }

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
          author: postData.UserName || "익명",
          writerId: postData.userId,
          writerName: postData.UserName,
          boardId: postData.boardId,
          attachments: formattedAttachments,
        };

        if (alive) setPost(formattedPost);

        Promise.resolve(loadCommentsByPost(postId)).catch((err) => {
          console.error("댓글 불러오기 실패:", err);
        });
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        if (alive) setPost(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (Number.isFinite(postId) && postId > 0) {
      fetchPost();
    } else {
      setPost(null);
      setLoading(false);
    }

    return () => {
      alive = false;
    };

  }, [postId]);

  if (loading) {
    return (
      <div className="detail-page">
        <PostDetailSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">
          <div className="title-text">해당 게시글을 찾을 수 없습니다.</div>
        </div>
        <button className="back-btn" onClick={() => navigate("/community/board")}>
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

  const canEdit =
    user &&
    ((user.userId !== 0 && Number(user.userId) === Number(post.writerId)) ||
      user.role === "ADMIN");

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
        onEdit={canEdit ? () => navigate(`/community/board/edit/${postId}`) : null}
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          author={user?.userName ?? user?.name ?? "익명"}
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