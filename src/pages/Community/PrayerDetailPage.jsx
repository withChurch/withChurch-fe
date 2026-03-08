import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/board/PostDetail.css";

import { useAuth } from "../../contexts/AuthContext";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";

import PostDetail from "../../components/board/PostDetail";
import PostDetailSkeleton from "../../components/skeleton/PostDetailSkeleton";

import CommentHeader from "../../components/board/CommentHeader";
import CommentWriteBox from "../../components/board/CommentWriteBox";
import CommentList from "../../components/board/CommentList";

const PrayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    prayerComments,
    prayerCommentsLoading,
    loadPrayerCommentsByPost,
    addPrayerComment,
    updatePrayerComment,
    deletePrayerComment,
    deletePrayerPost
  } = useBoard();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const existingComments = prayerComments?.[postId] || [];

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

        // 첨부파일을 PostDetail 컴포넌트 형식에 맞게 변환
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
          writerName: postData.UserName,
          boardId: postData.boardId,
          writerId: postData.userId,
          attachments: formattedAttachments,
        };

        if (alive) setPost(formattedPost);

        Promise.resolve(loadPrayerCommentsByPost(postId)).catch((err) => {
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
        <button className="back-btn" onClick={() => navigate("/community/prayer")}>
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
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePrayerPost(postId);
        navigate("/community/prayer");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  const canEdit =
    user &&
    ((user.userId !== 0 && Number(user.userId) === Number(post.writerId)) ||
      user.role === "ADMIN");

  return (
    <div className="detail-page">
      <PostDetail
        breadcrumb="◦ 소통과 공감 > 중보기도"
        title={post.title}
        author={post.author}
        date={post.date}
        content={post.content}
        files={post.attachments || []}
        onBack={() => navigate("/community/prayer")}
        onEdit={canEdit ? () => navigate(`/community/prayer/edit/${postId}`) : null}
        onDelete={canEdit ? handleDelete : null} 
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