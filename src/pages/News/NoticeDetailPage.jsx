// src/pages/News/NoticeDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import "../../components/board/PostDetail.css";

// ▼ AuthContext, BoardAPI 추가
import { useAuth } from "../../contexts/AuthContext";
import * as boardAPI from "../../api/boardAPI";
import { useBoard } from "../../contexts/BoardContext";

import PostDetail from "../../components/board/PostDetail";
import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ▼ 로그인 정보 가져오기
  const { user } = useAuth();

  const {
    // noticePosts 목록에서 찾는 기능 제거
    increaseNoticeViews,
    noticeComments,
    addNoticeComment,
    setNoticeComments,
  } = useBoard();

  const postId = Number(id);

  // ▼ 상세 데이터를 담을 State 생성
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = noticeComments[postId] || [];
  const fromUpdatesTop = location.state?.from === "updates-top";

  // ▼ 서버에서 상세 데이터 가져오기 (useEffect 수정)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // ★ API 호출: 상세 내용을 가져옵니다.
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
          content: postData.content || "", // ★ 본문 내용 확보
          date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
          views: postData.viewCount || 0,
          author: postData.UserName || "관리자",
          writerId: postData.userId, // 작성자 ID (수정 권한 확인용)
          files: formattedAttachments,
        };

        setPost(formattedPost);

        // 조회수 증가
        increaseNoticeViews(postId);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
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

  const handleSubmit = () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addNoticeComment(postId, commentText);
    setCommentText("");
    setIsWriting(false);
  };

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 교회 소식 > 공지사항"
        title={post.title}
        date={post.date}
        content={post.content} // ★ 서버에서 가져온 본문 표시
        files={post.files || []}
        
        // ▼ 목록 버튼 (기존 로직 유지)
        onBack={() =>
          navigate(fromUpdatesTop ? "/news/updates" : "/news/notices")
        }
        
        // ▼ 수정 버튼 조건 (관리자 권한 + 작성자 확인)
        onEdit={
            user &&
            (
              user.role === "ADMIN" || 
              (post.writerId && Number(user.userId) === Number(post.writerId))
            )
              ? () => navigate(`/news/notices/edit/${postId}`)
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

          setNoticeComments((prev) => ({
            ...prev,
            [postId]: updated,
          }));
        }}
        onDelete={(commentId) => {
          if (!window.confirm("삭제하시겠습니까?")) return;

          const filtered = existingComments.filter((c) => c.id !== commentId);

          setNoticeComments((prev) => ({
            ...prev,
            [postId]: filtered,
          }));
        }}
      />
    </div>
  );
};

export default NoticeDetailPage;