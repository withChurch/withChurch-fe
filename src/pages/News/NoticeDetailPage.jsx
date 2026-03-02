// src/pages/News/NoticeDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useAuth } from "../../contexts/AuthContext";
import * as boardAPI from "../../api/boardAPI";
import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
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
  } = useBoard();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = noticeComments[postId] || [];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await boardAPI.getPost(postId);
        const postData = response.data.data;

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

        setPost({
          id: postData.postId,
          title: postData.title,
          content: postData.content || "",
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: authorName,
          writerId: postData.userId,
          files: formattedAttachments,
        });

        // 조회수 증가(선택)
        increaseNoticeViews?.(postId);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (!postId) return;

    fetchPost();
    loadNoticeCommentsByPost(postId); // ✅ 댓글도 서버에서 불러오기
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-title-box">로딩 중...</div>
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
      // ✅ 서버 저장
      await addNoticeComment(postId, commentText, "공지사항");
      setCommentText("");
      setIsWriting(false);
    } catch (e) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

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
        onEdit={
          user &&
          (user.role === "ADMIN" ||
            (post.writerId && Number(user.userId) === Number(post.writerId)))
            ? () => navigate(`/news/notices/edit/${postId}`)
            : null
        }
      />

      <CommentHeader onWrite={() => setIsWriting(true)} />

      {isWriting && (
        <CommentWriteBox
          author={user?.name || localStorage.getItem("userName") || "익명"} // ✅ 작성박스 익명 방지
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
            await updateNoticeComment(postId, commentId, newText); // ✅ 서버 수정
          } catch (e) {
            alert("댓글 수정에 실패했습니다.");
          }
        }}
        onDelete={async (commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;
          try {
            await deleteNoticeComment(postId, commentId); // ✅ 서버 삭제
          } catch (e) {
            alert("댓글 삭제에 실패했습니다.");
          }
        }}
      />
    </div>
  );
};

export default NoticeDetailPage;