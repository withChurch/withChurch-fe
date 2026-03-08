import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useAuth } from "../../contexts/AuthContext";
import * as boardAPI from "../../api/boardAPI";
import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import PostDetailSkeleton from "../../components/skeleton/PostDetailSkeleton";

import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const postId = Number(id);

  const navigate = useNavigate();
  const location = useLocation();
  const fromUpdatesTop = location.state?.from === "updates-top";

  const { user } = useAuth();

  const {
    increaseNoticeViews, // (현재 no-op이어도 유지 가능)
    noticeComments,
    noticeCommentsLoading,
    loadNoticeCommentsByPost,
    addNoticeComment,
    updateNoticeComment,
    deleteNoticeComment,
    deleteNoticePost 
  } = useBoard();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = noticeComments?.[postId] || [];

  // (선택) 조회수 증가 중복 방지
  const increasedIdRef = useRef(null);

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

        const authorName = postData.userName || postData.UserName || "관리자";

        const formattedPost = {
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: authorName,
          writerId: postData.userId,
          files: formattedAttachments,
        };

        if (alive) setPost(formattedPost);

        Promise.resolve(loadNoticeCommentsByPost(postId)).catch((err) => {
          console.error("공지사항 댓글 불러오기 실패:", err);
        });

        if (increaseNoticeViews && increasedIdRef.current !== postId) {
          increasedIdRef.current = postId;
          Promise.resolve(increaseNoticeViews(postId)).catch((err) => {
            console.error("공지사항 조회수 증가 실패:", err);
          });
        }
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <button
          className="back-btn"
          onClick={() =>
            navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
          }
        >
          목록
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      await addNoticeComment(postId, commentText, "공지사항");
      setCommentText("");
      setIsWriting(false);
    } catch (e) {
      alert("댓글 작성에 실패했습니다.");
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

  const canEdit =
    user &&
    (user.role === "ADMIN" ||
      (post.writerId && Number(user.userId) === Number(post.writerId)));

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 교회 소식 > 공지사항"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.files || []}
        onBack={() => navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")}
        onEdit={canEdit ? () => navigate(`/news/notices/edit/${postId}`) : null}
        onDelete={canEdit ? handleDelete : null} 
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          author={user?.name || localStorage.getItem("userName") || "익명"}
          text={commentText}
          setText={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setIsWriting(false)}
        />
      )}

      <CommentList
        comments={existingComments}
        loading={noticeCommentsLoading}
        onUpdate={async (commentId, newText) => {
          try {
            await updateNoticeComment(postId, commentId, newText);
          } catch (e) {
            alert("댓글 수정에 실패했습니다.");
          }
        }}
        onDelete={async (commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          try {
            await deleteNoticeComment(postId, commentId);
          } catch (e) {
            alert("댓글 삭제에 실패했습니다.");
          }
        }}
      />
    </div>
  );
};

export default NoticeDetailPage;