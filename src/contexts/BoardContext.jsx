// src/contexts/BoardContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as boardAPI from "../api/boardAPI";
import * as commentAPI from "../api/commentAPI";
import * as attachmentAPI from "../api/attachmentAPI";

export const BoardContext = createContext();

// ------------------------------
// 공통 유틸
// ------------------------------
const toYmd = (iso) => (iso ? String(iso).split("T")[0] : "");

const pickName = (obj) => {
  if (!obj) return null;
  return obj.userName ?? obj.UserName ?? obj.name ?? obj.nickname ?? null;
};

export function BoardProvider({ children }) {
  const { user } = useAuth();

  const getFallbackAuthor = () =>
    user?.name || localStorage.getItem("userName") || "익명";

  const formatComment = (dto, fallbackAuthor = "익명") => {
    if (!dto) return null;
    return {
      id: dto.commentId ?? dto.id,
      content: dto.content ?? "",
      date: toYmd(dto.updatedAt || dto.createdAt),
      author: pickName(dto) || fallbackAuthor,
      writerId: dto.userId ?? dto.writerId ?? null,
      postId: dto.postId ?? null,
      boardId: dto.boardId ?? null,
    };
  };

  const formatCommentList = (list, fallbackAuthor = "익명") =>
    (list || []).map((dto) => formatComment(dto, fallbackAuthor)).filter(Boolean);

  // ==========================
  // 게시판 목록 및 매핑
  // ==========================
  const [boards, setBoards] = useState([]);
  const [boardMap, setBoardMap] = useState({}); // { "자유게시판": boardId, ... }

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await boardAPI.getAllBoards();
        const boardsList = response.data.data || [];
        setBoards(boardsList);

        const map = {};
        boardsList.forEach((board) => {
          map[board.name] = board.boardId;
        });
        setBoardMap(map);
      } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error);
      }
    };

    fetchBoards();
  }, []);

  // ==========================
  // 게시글 상세 조회 (공통)
  // ==========================
  const getPost = async (id) => {
    try {
      const response = await boardAPI.getPost(id);
      const postData = response.data.data;

      const authorName = pickName(postData) || "익명";

      return {
        id: postData.postId,
        title: postData.title,
        content: postData.content,
        date: toYmd(postData.createdAt),
        views: postData.viewCount || 0,
        author: authorName,
        writerId: postData.userId,
        writerName: authorName,
        boardId: postData.boardId,
        attachments: postData.attachments || [],
        images: postData.images || postData.imageIds || [],
      };
    } catch (error) {
      console.error("게시글 상세 조회 실패:", error);
      throw error;
    }
  };

  /* ============================================
      1) 자유게시판 (board)
  ============================================ */
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const [comments, setComments] = useState({});
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [postsTotalElements, setPostsTotalElements] = useState(0);

  const loadPosts = async (page = 0, opts= {}) => {
    const boardId = boardMap["자유게시판"];
    if (!boardId) return;

    const {
    size = 10,
    sort = "createdAt,desc",
    keyword = "",
  } = opts;

    setPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(
        boardId, 
        page, 
        size,
        sort,
        keyword
      );
      const pageData = response.data.data;
      const postsList = pageData.content || [];

      const formattedPosts = postsList.map((post) => {
        const authorName = pickName(post) || "익명";
        return {
          id: post.postId,
          title: post.title,
          date: toYmd(post.createdAt),
          views: post.viewCount || 0,
          author: authorName,

          content: post.content || "",
          writerId: post.userId ?? null,
          writerName: authorName,
          boardId: post.boardId,
        };
      });

      setPosts(formattedPosts);
      setPostsTotalPages(pageData.totalPages ?? 0);
      setPostsTotalElements(pageData.totalElements ?? 0);
    } catch (e) {
      console.error("loadPosts error:", e);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["자유게시판"]) loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["자유게시판"]]);

  const loadCommentsByPost = async (postId) => {
    setCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const addPost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["자유게시판"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadPosts();
      return response.data.data;
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      throw error;
    }
  };

  const updatePost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadPosts();
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      throw error;
    }
  };

  const increaseViews = () => {};

  const addComment = async (postId, content, category) => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
        category,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명", // ✅ 기존 유지
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      throw error;
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      2) 중보기도 (prayer)
  ============================================ */
  const [prayerPosts, setPrayerPosts] = useState([]);
  const [prayerPostsLoading, setPrayerPostsLoading] = useState(false);

  const [prayerComments, setPrayerComments] = useState({});
  const [prayerCommentsLoading, setPrayerCommentsLoading] = useState(false);

  const [prayerPostsTotalPages, setPrayerPostsTotalPages] = useState(1);
  const [prayerPostsTotalElements, setPrayerPostsTotalElements] = useState(0);

  const loadPrayerPosts = async (page = 0, opts = {}) => {
  const boardId = boardMap?.["중보기도"];
  if (!boardId) return;

  const { size = 10, sort = "createdAt,desc", keyword = "" } = opts;

  setPrayerPostsLoading(true);
  try {
    const response = await boardAPI.getPostsByBoard(
      boardId,
      page,
      size,
      sort,
      keyword
    );

    const pageData = response.data.data;
    const postsList = pageData.content || [];

    const formattedPosts = postsList.map((post) => {
      const authorName = pickName(post) || "익명";
      return {
        id: post.postId,
        title: post.title,
        date: toYmd(post.createdAt),
        views: post.viewCount || 0,
        author: authorName,
        content: post.content || "", // 목록에 content 없으면 "" 유지
        writerId: post.userId ?? null,
        writerName: authorName,
        boardId: post.boardId,
      };
    });

    setPrayerPosts(formattedPosts);

    setPrayerPostsTotalPages(pageData.totalPages || 1);
    setPrayerPostsTotalElements(
      typeof pageData.totalElements === "number" ? pageData.totalElements : 0
    );
  } catch (error) {
    console.error("중보기도 게시글 불러오기 실패:", error);
  } finally {
    setPrayerPostsLoading(false);
  }
};

  useEffect(() => {
    if (boardMap["중보기도"]) loadPrayerPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["중보기도"]]);

  const loadPrayerCommentsByPost = async (postId) => {
    setPrayerCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setPrayerComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("중보기도 댓글 불러오기 실패:", error);
    } finally {
      setPrayerCommentsLoading(false);
    }
  };

  const addPrayerPost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["중보기도"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadPrayerPosts();
      return response.data.data;
    } catch (error) {
      console.error("중보기도 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updatePrayerPost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadPrayerPosts();
    } catch (error) {
      console.error("중보기도 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deletePrayerPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setPrayerPosts((prev) => prev.filter((p) => p.id !== id));
      setPrayerComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("중보기도 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const increasePrayerViews = () => {};

  const addPrayerComment = async (postId, content, category) => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
      };

      setPrayerComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("중보기도 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updatePrayerComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setPrayerComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명",
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("중보기도 댓글 수정 실패:", error);
      throw error;
    }
  };

  const deletePrayerComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setPrayerComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("중보기도 댓글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      3) 공지사항 (notices) 
  ============================================ */
  const [noticePosts, setNoticePosts] = useState([]);
  const [noticePostsLoading, setNoticePostsLoading] = useState(false);

  const [noticeComments, setNoticeComments] = useState({});
  const [noticeCommentsLoading, setNoticeCommentsLoading] = useState(false);

  const [noticePostsTotalPages, setNoticePostsTotalPages] = useState(1);
  const [noticePostsTotalElements, setNoticePostsTotalElements] = useState(0);

  const loadNoticePosts = async (page = 0, opts = {}) => {
    const boardId = boardMap?.["공지사항"];
    if (!boardId) return;

    const { size = 10, sort = "createdAt,desc", keyword = "" } = opts;

    setNoticePostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(
        boardId,
        page,
        size,
        sort,
        keyword
      );

      const pageData = response.data.data;
      const postsList = pageData.content || [];

      const formatted = postsList.map((post) => {
        const authorName = pickName(post) || "관리자";
        return {
          id: post.postId,
          title: post.title,
          date: toYmd(post.createdAt),
          views: post.viewCount || 0,
          author: authorName,
          content: post.content || "",
          writerId: post.userId ?? null,
          writerName: authorName,
          boardId: post.boardId,
        };
      });

      setNoticePosts(formatted);
      setNoticePostsTotalPages(pageData.totalPages || 1);
      setNoticePostsTotalElements(
        typeof pageData.totalElements === "number" ? pageData.totalElements : 0
      );
    } catch (error) {
      console.error("공지사항 게시글 불러오기 실패:", error);
    } finally {
      setNoticePostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["공지사항"]) loadNoticePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["공지사항"]]);

  const addNoticePost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["공지사항"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadNoticePosts();
      return response.data.data;
    } catch (error) {
      console.error("공지사항 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateNoticePost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadNoticePosts();
    } catch (error) {
      console.error("공지사항 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteNoticePost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setNoticePosts((prev) => prev.filter((p) => p.id !== id));
      setNoticeComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("공지사항 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const increaseNoticeViews = () => {};

  const loadNoticeCommentsByPost = async (postId) => {
    setNoticeCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setNoticeComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("공지사항 댓글 불러오기 실패:", error);
    } finally {
      setNoticeCommentsLoading(false);
    }
  };

  const addNoticeComment = async (postId, content, category = "공지사항") => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
      };

      setNoticeComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("공지사항 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateNoticeComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setNoticeComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명",
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("공지사항 댓글 수정 실패:", error);
      throw error;
    }
  };

  const deleteNoticeComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setNoticeComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("공지사항 댓글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      4) 교회소식 (updates)
  ============================================ */
  const [updatePosts, setUpdatePosts] = useState([]);
  const [updatePostsLoading, setUpdatePostsLoading] = useState(false);

  const [updateComments, setUpdateComments] = useState({});
  const [updateCommentsLoading, setUpdateCommentsLoading] = useState(false);

  const [updatePostsTotalPages, setUpdatePostsTotalPages] = useState(1);
  const [updatePostsTotalElements, setUpdatePostsTotalElements] = useState(0);

  const loadUpdatePosts = async (page = 0, opts = {}) => {
    const boardId = boardMap?.["교회소식"];
    if (!boardId) return;

    const { size = 10, sort = "createdAt,desc", keyword = "" } = opts;

    setUpdatePostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(
        boardId,
        page,
        size,
        sort,
        keyword
      );

      const pageData = response.data.data;
      const postsList = pageData.content || [];

      const formatted = postsList.map((post) => {
        const authorName = pickName(post) || "관리자";
        return {
          id: post.postId,
          title: post.title,
          date: toYmd(post.createdAt),
          views: post.viewCount || 0,
          author: authorName,
          content: post.content || "",
          writerId: post.userId ?? null,
          writerName: authorName,
          boardId: post.boardId,
        };
      });

      setUpdatePosts(formatted);
      setUpdatePostsTotalPages(pageData.totalPages || 1);
      setUpdatePostsTotalElements(
        typeof pageData.totalElements === "number" ? pageData.totalElements : 0
      );
    } catch (error) {
      console.error("교회소식 게시글 불러오기 실패:", error);
    } finally {
      setUpdatePostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["교회소식"]) loadUpdatePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["교회소식"]]);

  const addUpdatePost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["교회소식"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadUpdatePosts();
      return response.data.data;
    } catch (error) {
      console.error("교회소식 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateUpdatePost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadUpdatePosts();
    } catch (error) {
      console.error("교회소식 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteUpdatePost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setUpdatePosts((prev) => prev.filter((p) => p.id !== id));
      setUpdateComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("교회소식 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const increaseUpdateViews = () => {};

  const loadUpdateCommentsByPost = async (postId) => {
    setUpdateCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setUpdateComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("교회소식 댓글 불러오기 실패:", error);
    } finally {
      setUpdateCommentsLoading(false);
    }
  };

  const addUpdateComment = async (postId, content, category = "교회소식") => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
      };

      setUpdateComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("교회소식 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateUpdateComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setUpdateComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명",
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("교회소식 댓글 수정 실패:", error);
      throw error;
    }
  };

  const deleteUpdateComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setUpdateComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("교회소식 댓글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      5) 주일예배 
  ============================================ */
  const [sundayPosts, setSundayPosts] = useState([]);
  const [sundayPostsLoading, setSundayPostsLoading] = useState(false);

  const [sundayComments, setSundayComments] = useState({});
  const [sundayCommentsLoading, setSundayCommentsLoading] = useState(false);

  const [sundayPostsTotalPages, setSundayPostsTotalPages] = useState(1);

  const loadSundayPosts = async (page = 0, opts = {}) => {
    const boardId = boardMap?.["주일예배"];
    if (!boardId) return;

    const { size = 6, sort = "createdAt,desc", keyword = "" } = opts;

    setSundayPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(
        boardId,
        page,
        size,
        sort,
        keyword
      );

      const pageData = response.data.data;
      const postsList = pageData.content || [];

      const formatted = postsList.map((post) => {
        const authorName = pickName(post) || "관리자";
        return {
          id: post.postId,
          title: post.title,
          date: toYmd(post.createdAt),
          views: post.viewCount || 0,
          author: authorName,
          content: post.content || "",
          writerId: post.userId ?? null,
          writerName: authorName,
          boardId: post.boardId,
        };
      });

      setSundayPosts(formatted);
      setSundayPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("주일예배 게시글 불러오기 실패:", error);
      setSundayPosts([]);
      setSundayPostsTotalPages(1);
    } finally {
      setSundayPostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["주일예배"]) loadSundayPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["주일예배"]]);

  const addSundayPost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["주일예배"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadSundayPosts();
      return response.data.data;
    } catch (error) {
      console.error("주일예배 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateSundayPost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadSundayPosts();
    } catch (error) {
      console.error("주일예배 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteSundayPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setSundayPosts((prev) => prev.filter((p) => p.id !== id));
      setSundayComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("주일예배 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const loadSundayCommentsByPost = async (postId) => {
    setSundayCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setSundayComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("주일예배 댓글 불러오기 실패:", error);
    } finally {
      setSundayCommentsLoading(false);
    }
  };

  const addSundayComment = async (postId, content, category = "주일예배") => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
      };

      setSundayComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("주일예배 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateSundayComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setSundayComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명",
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("주일예배 댓글 수정 실패:", error);
      throw error;
    }
  };

  const deleteSundayComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setSundayComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("주일예배 댓글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      6) 새벽예배
  ============================================ */
  const [dawnPosts, setDawnPosts] = useState([]);
  const [dawnPostsLoading, setDawnPostsLoading] = useState(false);

  const [dawnComments, setDawnComments] = useState({});
  const [dawnCommentsLoading, setDawnCommentsLoading] = useState(false);

  const [dawnPostsTotalPages, setDawnPostsTotalPages] = useState(1);

  const loadDawnPosts = async (page = 0, opts = {}) => {
    const boardId = boardMap?.["새벽예배"];
    if (!boardId) return;

    const { size = 6, sort = "createdAt,desc", keyword = "" } = opts;

    setDawnPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(
        boardId,
        page,
        size,
        sort,
        keyword
      );

      const pageData = response.data.data;
      const postsList = pageData.content || [];

      const formatted = postsList.map((post) => {
        const authorName = pickName(post) || "관리자";
        return {
          id: post.postId,
          title: post.title,
          date: toYmd(post.createdAt),
          views: post.viewCount || 0,
          author: authorName,
          content: post.content || "",
          writerId: post.userId ?? null,
          writerName: authorName,
          boardId: post.boardId,
        };
      });

      setDawnPosts(formatted);
      setDawnPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("새벽예배 게시글 불러오기 실패:", error);
      setDawnPosts([]);
      setDawnPostsTotalPages(1);
    } finally {
      setDawnPostsLoading(false);
    }
  };
  useEffect(() => {
    if (boardMap["새벽예배"]) loadDawnPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMap["새벽예배"]]);

  const addDawnPost = async ({ title, content, files = [], images = [], imageIds, boardId }) => {
    const targetBoardId = boardId || boardMap["새벽예배"];
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const response = await attachmentAPI.uploadFiles(files);
        attachmentIds = response.data.data.map((item) => item.attachmentId);
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: imageIds || images || [],
      });

      await loadDawnPosts();
      return response.data.data;
    } catch (error) {
      console.error("새벽예배 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateDawnPost = async (id, { title, content, files = [], images = [], imageIds }) => {
    try {
      let attachmentIds = [];

      if (files && files.length > 0) {
        const newFiles = files.filter((f) => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        }

        const existingIds = files
          .filter((f) => !(f instanceof File) && (f.id || f.attachmentId))
          .map((f) => f.id || f.attachmentId);

        attachmentIds = [...attachmentIds, ...existingIds];
      }

      await boardAPI.updatePost(id, {
        title,
        content,
        attachmentIds,
        imageIds: imageIds || images || [],
      });

      await loadDawnPosts();
    } catch (error) {
      console.error("새벽예배 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteDawnPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setDawnPosts((prev) => prev.filter((p) => p.id !== id));
      setDawnComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("새벽예배 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const loadDawnCommentsByPost = async (postId) => {
    setDawnCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const list = response.data.data || [];
      setDawnComments((prev) => ({
        ...prev,
        [postId]: formatCommentList(list, "익명"),
      }));
    } catch (error) {
      console.error("새벽예배 댓글 불러오기 실패:", error);
    } finally {
      setDawnCommentsLoading(false);
    }
  };

  const addDawnComment = async (postId, content, category = "새벽예배") => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const dto = response.data.data;

      const newComment = formatComment(dto, getFallbackAuthor()) || {
        id: Date.now(),
        content,
        date: toYmd(new Date().toISOString()),
        author: getFallbackAuthor(),
        writerId: user?.userId ?? null,
        postId,
      };

      setDawnComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], { ...newComment, category }] : [{ ...newComment, category }],
      }));
    } catch (error) {
      console.error("새벽예배 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateDawnComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const dto = response.data.data || {};

      setDawnComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              content: dto.content ?? content ?? c.content,
              date: toYmd(dto.updatedAt || dto.createdAt) || c.date,
              author: pickName(dto) || c.author || "익명",
              writerId: dto.userId ?? c.writerId,
            };
          }) || [],
      }));
    } catch (error) {
      console.error("새벽예배 댓글 수정 실패:", error);
      throw error;
    }
  };

  const deleteDawnComment = async (postId, commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setDawnComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId) || [],
      }));
    } catch (error) {
      console.error("새벽예배 댓글 삭제 실패:", error);
      throw error;
    }
  };

  // ==========================
  // Provider
  // ==========================
  return (
    <BoardContext.Provider
      value={{
        boards,
        boardMap,
        getPost,

        // 자유게시판
        posts,
        postsLoading,
        postsTotalPages,
        postsTotalElements,
        loadPosts,
        addPost,
        updatePost,
        deletePost,
        comments,
        commentsLoading,
        loadCommentsByPost,
        addComment,
        updateComment,
        deleteComment,
        increaseViews,

        // 중보기도
        prayerPosts,
        prayerPostsLoading,
        prayerPostsTotalPages,
        prayerPostsTotalElements,
        loadPrayerPosts,
        addPrayerPost,
        updatePrayerPost,
        deletePrayerPost,
        prayerComments,
        prayerCommentsLoading,
        loadPrayerCommentsByPost,
        addPrayerComment,
        updatePrayerComment,
        deletePrayerComment,
        increasePrayerViews,

        // 공지사항
        noticePosts,
        noticePostsLoading,
        noticePostsTotalPages,
        noticePostsTotalElements,
        loadNoticePosts,
        addNoticePost,
        updateNoticePost,
        deleteNoticePost,
        noticeComments,
        noticeCommentsLoading,
        loadNoticeCommentsByPost,
        addNoticeComment,
        updateNoticeComment,
        deleteNoticeComment,
        increaseNoticeViews,

        // 교회소식
        updatePosts,
        updatePostsLoading,
        updatePostsTotalPages,
        updatePostsTotalElements,
        loadUpdatePosts,
        addUpdatePost,
        updateUpdatePost,
        deleteUpdatePost,
        updateComments,
        updateCommentsLoading,
        loadUpdateCommentsByPost,
        addUpdateComment,
        updateUpdateComment,
        deleteUpdateComment,
        increaseUpdateViews,

        // 주일예배
        sundayPosts,
        sundayPostsLoading,
        sundayPostsTotalPages,
        loadSundayPosts,
        addSundayPost,
        updateSundayPost,
        deleteSundayPost,
        sundayComments,
        sundayCommentsLoading,
        loadSundayCommentsByPost,
        addSundayComment,
        updateSundayComment,
        deleteSundayComment,

        // 새벽예배
        dawnPosts,
        dawnPostsLoading,
        dawnPostsTotalPages,
        loadDawnPosts,
        addDawnPost,
        updateDawnPost,
        deleteDawnPost,
        dawnComments,
        dawnCommentsLoading,
        loadDawnCommentsByPost,
        addDawnComment,
        updateDawnComment,
        deleteDawnComment,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}