// src/contexts/BoardContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as boardAPI from "../api/boardAPI";
import * as commentAPI from "../api/commentAPI";
import * as attachmentAPI from "../api/attachmentAPI";

export const BoardContext = createContext();

export function BoardProvider({ children }) {
  const { user } = useAuth();

  // 게시판 목록 및 매핑
  const [boards, setBoards] = useState([]);
  const [boardMap, setBoardMap] = useState({}); // { "자유게시판": boardId, ... }

  // 게시판 목록 불러오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await boardAPI.getAllBoards();
        const boardsList = response.data.data || [];
        setBoards(boardsList);
        
        // 게시판 이름으로 boardId 매핑
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

  const getPost = async (id) => {
    try {
      const response = await boardAPI.getPost(id); 
      const postData = response.data.data;

      return {
        id: postData.postId,
        title: postData.title,
        content: postData.content,
        date: postData.createdAt ? postData.createdAt.split("T")[0] : "",
        views: postData.viewCount || 0,
        author: postData.UserName || "익명",
        writerId: postData.userId,
        writerName: postData.UserName,
        boardId: postData.boardId,
        attachments: postData.attachments || [],
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

  // 게시글별 댓글 불러오기
  const loadCommentsByPost = async (postId) => {
    setCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const commentsList = response.data.data || [];
      
      const formattedComments = commentsList.map((comment) => ({
        id: comment.commentId,
        content: comment.content,
        date: comment.createdAt ? comment.createdAt.split("T")[0] : "",
        author: comment.UserName || "익명", 
        writerId: comment.userId,
        postId: comment.postId, 
      }));

      setComments((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // 자유게시판 게시글 불러오기
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const loadPosts = async (page = 0) => {
    const boardId = boardMap["자유게시판"];
    if (!boardId) return;
    
    setPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "익명",
        content: "", // 목록에서는 content 없음
        writerId: null, // 목록 응답에 없음
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setPosts(formattedPosts);
      setPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setPostsLoading(false);
    }
  };


  useEffect(() => {
    if (boardMap["자유게시판"]) {
      loadPosts();
    }
  }, [boardMap["자유게시판"]]);

  const addPost = async ({ title, content, files = [], images = [], boardId }) => {
  const targetBoardId = boardId || boardMap["자유게시판"];    
  if (!targetBoardId) {
      throw new Error("게시판을 찾을 수 없습니다.");
    }

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      // 2. 게시글 작성 (첨부파일 ID 포함)
      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      const newPost = response.data.data;
      
      // 목록 새로고침
      await loadPosts();
      
      return {
        id: newPost.postId,
        title: newPost.title,
        content: newPost.content,
        date: newPost.createdAt ? newPost.createdAt.split("T")[0] : "",
        views: newPost.viewCount || 0,
        author: newPost.UserName,
        writerId: user?.id,
        writerName: newPost.UserName,
        attachments: newPost.attachments || [],
      };
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      throw error;
    }
  };

  const increaseViews = (id) => {
    // 조회수는 상세 조회 시 자동으로 증가하므로 여기서는 처리하지 않음
  };

  const addComment = async (postId, content, category) => {
    try {
      const response = await commentAPI.createComment({
        postId,
        content,
      });
      
      const newCommentData = response.data.data;
      const newComment = {
        id: newCommentData.commentId,
        content: newCommentData.content,
        date: newCommentData.createdAt ? newCommentData.createdAt.split("T")[0] : "",
        author: newCommentData.userName || "익명",
        writerId: newCommentData.userId,
        postId: newCommentData.postId,
        category,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
      }));
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      throw error;
    }
  };

  const updateComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const updatedCommentData = response.data.data;
      
      const updatedComment = {
        id: updatedCommentData.commentId,
        content: updatedCommentData.content,
        date: updatedCommentData.createdAt ? updatedCommentData.createdAt.split("T")[0] : "",
        author: updatedCommentData.userName || "익명",
        writerId: updatedCommentData.userId,
        postId: updatedCommentData.postId,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.map((c) =>
          c.id === commentId ? { ...c, ...updatedComment } : c
        ) || [],
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

  const updatePost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      
      // 새로 추가된 파일이 있으면 업로드
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        
        // 기존 첨부파일 ID가 있으면 포함
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, 
        { 
          title, 
          content, 
          attachmentIds, 
          imageIds: images
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
      setPosts(prev => prev.filter(p => p.id !== id));
      setComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
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

  // 중보기도 게시글별 댓글 불러오기
  const loadPrayerCommentsByPost = async (postId) => {
    setPrayerCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const commentsList = response.data.data || [];
      
      const formattedComments = commentsList.map((comment) => ({
        id: comment.commentId,
        content: comment.content,
        date: comment.createdAt ? comment.createdAt.split("T")[0] : "",
        author: comment.userName || "익명",
        writerId: comment.userId,
        postId: comment.postId,
      }));

      setPrayerComments((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("중보기도 댓글 불러오기 실패:", error);
    } finally {
      setPrayerCommentsLoading(false);
    }
  };

  // 중보기도 게시글 불러오기
  const [prayerPostsTotalPages, setPrayerPostsTotalPages] = useState(1);
  const loadPrayerPosts = async (page = 0) => {
    const boardId = boardMap["중보기도"];
    if (!boardId) return;
    
    setPrayerPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "익명",
        content: "",
        writerId: null,
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setPrayerPosts(formattedPosts);
      setPrayerPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("중보기도 게시글 불러오기 실패:", error);
    } finally {
      setPrayerPostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["중보기도"]) {
      loadPrayerPosts();
    }
  }, [boardMap["중보기도"]]);

    const addPrayerPost = async ({ title, content, files = [], images = [], boardId }) => {
    
    const targetBoardId = boardId || boardMap["중보기도"];
    
    if (!targetBoardId) throw new Error("게시판을 찾을 수 없습니다.");

    try {
      // 1. 파일이 있으면 먼저 업로드 (수정됨)
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      // 2. 게시글 작성 (첨부파일 ID 포함)
      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      await loadPrayerPosts();
      return response.data.data;
    } catch (error) {
      console.error("중보기도 게시글 작성 실패:", error);
      throw error;
    }
  };

  const increasePrayerViews = (id) => {
    // 조회수는 상세 조회 시 자동으로 증가
  };

  const addPrayerComment = async (postId, content, category) => {
    try {
      const response = await commentAPI.createComment({
        postId,
        content,
      });
      
      const newCommentData = response.data.data;
      const newComment = {
        id: newCommentData.commentId,
        content: newCommentData.content,
        date: newCommentData.createdAt ? newCommentData.createdAt.split("T")[0] : "",
        author: newCommentData.userName || "익명",
        writerId: newCommentData.userId,
        postId: newCommentData.postId,
        category,
      };

      setPrayerComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
      }));
    } catch (error) {
      console.error("중보기도 댓글 작성 실패:", error);
      throw error;
    }
  };

  const updatePrayerComment = async (postId, commentId, content) => {
    try {
      const response = await commentAPI.updateComment(commentId, { content });
      const updatedCommentData = response.data.data;
      
      const updatedComment = {
        id: updatedCommentData.commentId,
        content: updatedCommentData.content,
        date: updatedCommentData.createdAt ? updatedCommentData.createdAt.split("T")[0] : "",
        author: updatedCommentData.userName || "익명",
        writerId: updatedCommentData.userId,
        postId: updatedCommentData.postId,
      };

      setPrayerComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.map((c) =>
          c.id === commentId ? { ...c, ...updatedComment } : c
        ) || [],
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

  const updatePrayerPost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        
        // 기존 첨부파일 ID가 있으면 포함
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, { title, content, attachmentIds, imageIds: images });
      await loadPrayerPosts();
    } catch (error) {
      console.error("중보기도 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deletePrayerPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setPrayerPosts(prev => prev.filter(p => p.id !== id));
      setPrayerComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("중보기도 게시글 삭제 실패:", error);
      throw error;
    }
  };


  /* ============================================
      3) 공지사항 (notices)
  ============================================ */
  const [noticePosts, setNoticePosts] = useState([]);
  const [noticePostsLoading, setNoticePostsLoading] = useState(false);
  const [noticeComments, setNoticeComments] = useState({});

  // 공지사항 게시글 불러오기
  const [noticePostsTotalPages, setNoticePostsTotalPages] = useState(1);
  const loadNoticePosts = async (page = 0) => {
    const boardId = boardMap["공지사항"];
    if (!boardId) return;
    
    setNoticePostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "관리자",
        content: "",
        writerId: null,
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setNoticePosts(formattedPosts);
      setNoticePostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("공지사항 게시글 불러오기 실패:", error);
    } finally {
      setNoticePostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["공지사항"]) {
      loadNoticePosts();
    }
  }, [boardMap["공지사항"]]);

  const addNoticePost = async ({ title, content, files = [], images = [], boardId }) => {
    
    const targetBoardId = boardId || boardMap["공지사항"];

    if (!targetBoardId) {
      throw new Error("게시판을 찾을 수 없습니다.");
    }

    try {
      // 1. 파일이 있으면 먼저 업로드 (수정됨)
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      // 2. 게시글 작성 (첨부파일 ID 포함)
      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      await loadNoticePosts();
      return response.data.data;
    } catch (error) {
      console.error("공지사항 게시글 작성 실패:", error);
      throw error;
    }
  };

  const increaseNoticeViews = (id) => {
    // 조회수는 상세 조회 시 자동으로 증가
  };

  const addNoticeComment = (postId, content) => {
    const newComment = {
      id: Date.now(),      
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setNoticeComments(prev => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment]
    }));
  };

  const updateNoticePost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        
        // 기존 첨부파일 ID가 있으면 포함
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, { title, content, attachmentIds, imageIds: images });
      await loadNoticePosts();
    } catch (error) {
      console.error("공지사항 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteNoticePost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setNoticePosts(prev => prev.filter(p => p.id !== id));
      setNoticeComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("공지사항 게시글 삭제 실패:", error);
      throw error;
    }
  };


  /* ============================================
      4) 교회소식 (updates)
  ============================================ */
  const [updatePosts, setUpdatePosts] = useState([]);
  const [updatePostsLoading, setUpdatePostsLoading] = useState(false);
  const [updateComments, setUpdateComments] = useState({});

  // 교회소식 게시글 불러오기
  const [updatePostsTotalPages, setUpdatePostsTotalPages] = useState(1);
  const loadUpdatePosts = async (page = 0) => {
    const boardId = boardMap["교회소식"];
    if (!boardId) return;
    
    setUpdatePostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "관리자",
        content: "",
        writerId: null,
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setUpdatePosts(formattedPosts);
      setUpdatePostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("교회소식 게시글 불러오기 실패:", error);
    } finally {
      setUpdatePostsLoading(false);
    }
  };

  useEffect(() => {
    if (boardMap["교회소식"]) {
      loadUpdatePosts();
    }
  }, [boardMap["교회소식"]]);

  const addUpdatePost = async ({ title, content, files = [], images = [], boardId }) => {
    
    const targetBoardId = boardId || boardMap["교회소식"];

    if (!targetBoardId) {
      throw new Error("게시판을 찾을 수 없습니다.");
    }

    try {
      // 1. 파일이 있으면 먼저 업로드 (수정됨)
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      // 2. 게시글 작성 (첨부파일 ID 포함)
      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      await loadUpdatePosts();
      return response.data.data;
    } catch (error) {
      console.error("교회소식 게시글 작성 실패:", error);
      throw error;
    }
  };

  const increaseUpdateViews = (id) => {
    // 조회수는 상세 조회 시 자동으로 증가
  };

  const addUpdateComment = (postId, content) => {
    const newComment = {
      id: Date.now(),
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setUpdateComments(prev => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment]
    }));
  };

  const updateUpdatePost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        
        // 기존 첨부파일 ID가 있으면 포함
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, { title, content, attachmentIds, imageIds: images });
      await loadUpdatePosts();
    } catch (error) {
      console.error("교회소식 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteUpdatePost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setUpdatePosts(prev => prev.filter(p => p.id !== id));
      setUpdateComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("교회소식 게시글 삭제 실패:", error);
      throw error;
    }
  };

  /* ============================================
      5) 주일예배 ID: 5
  ============================================ */
  const [sundayPosts, setSundayPosts] = useState([]);
  const [sundayPostsLoading, setSundayPostsLoading] = useState(false);
  const [sundayComments, setSundayComments] = useState({});
  const [sundayCommentsLoading, setSundayCommentsLoading] = useState(false);

  const loadSundayCommentsByPost = async (postId) => {
    setSundayCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const commentsList = response.data.data || [];
      
      const formattedComments = commentsList.map((comment) => ({
        id: comment.commentId,
        content: comment.content,
        date: comment.createdAt ? comment.createdAt.split("T")[0] : "",
        author: comment.userName || "익명",
        writerId: comment.userId,
        postId: comment.postId,
      }));

      setSundayComments((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("주일예배 댓글 불러오기 실패:", error);
    } finally {
      setSundayCommentsLoading(false);
    }
  };

  const [sundayPostsTotalPages, setSundayPostsTotalPages] = useState(1);
  const loadSundayPosts = async (page = 0) => {
    const boardId = boardMap["주일예배"] || 5;
    
    setSundayPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "관리자",
        content: "",
        writerId: null,
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setSundayPosts(formattedPosts);
      setSundayPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("주일예배 게시글 불러오기 실패:", error);
    } finally {
      setSundayPostsLoading(false);
    }
  };

  useEffect(() => {
    loadSundayPosts();
  }, [boardMap["주일예배"]]);

  const addSundayPost = async ({ title, content, files = [], images = [], boardId }) => {
    
    const targetBoardId = boardId || boardMap["주일예배"];

    if (!targetBoardId) {
      throw new Error("게시판을 찾을 수 없습니다.");
    }

    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      await loadSundayPosts();
      return response.data.data;
    } catch (error) {
      console.error("주일예배 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateSundayPost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, { title, content, attachmentIds, imageIds: images });
      await loadSundayPosts();
    } catch (error) {
      console.error("주일예배 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteSundayPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setSundayPosts(prev => prev.filter(p => p.id !== id));
      setSundayComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("주일예배 게시글 삭제 실패:", error);
      throw error;
    }
  };

  const addSundayComment = async (postId, content, category) => {
    try {
      const response = await commentAPI.createComment({ postId, content });
      const newCommentData = response.data.data;
      const newComment = {
        id: newCommentData.commentId,
        content: newCommentData.content,
        date: newCommentData.createdAt ? newCommentData.createdAt.split("T")[0] : "",
        author: newCommentData.userName || "익명",
        writerId: newCommentData.userId,
        postId: newCommentData.postId,
        category,
      };
      setSundayComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
      }));
    } catch (error) {
      console.error("주일예배 댓글 작성 실패:", error);
      throw error;
    }
  };

  /* ============================================
      6) 새벽예배 ID: 6
  ============================================ */
  const [dawnPosts, setDawnPosts] = useState([]);
  const [dawnPostsLoading, setDawnPostsLoading] = useState(false);
  const [dawnComments, setDawnComments] = useState({});
  const [dawnCommentsLoading, setDawnCommentsLoading] = useState(false);

  // 새벽예배 댓글 불러오기
  const loadDawnCommentsByPost = async (postId) => {
    setDawnCommentsLoading(true);
    try {
      const response = await commentAPI.getCommentsByPost(postId);
      const commentsList = response.data.data || [];
      
      const formattedComments = commentsList.map((comment) => ({
        id: comment.commentId,
        content: comment.content,
        date: comment.createdAt ? comment.createdAt.split("T")[0] : "",
        author: comment.userName || "익명",
        writerId: comment.userId,
        postId: comment.postId,
      }));

      setDawnComments((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("새벽예배 댓글 불러오기 실패:", error);
    } finally {
      setDawnCommentsLoading(false);
    }
  };

  // 새벽예배 게시글 불러오기
  const [dawnPostsTotalPages, setDawnPostsTotalPages] = useState(1);
  const loadDawnPosts = async (page = 0) => {
    const boardId = boardMap["새벽예배"] || 6;
    
    setDawnPostsLoading(true);
    try {
      const response = await boardAPI.getPostsByBoard(boardId, page, 10);
      const pageData = response.data.data;
      const postsList = pageData.content || [];
      
      const formattedPosts = postsList.map((post) => ({
        id: post.postId,
        title: post.title,
        date: post.createdAt ? post.createdAt.split("T")[0] : "",
        views: post.viewCount || 0,
        author: post.UserName || "관리자",
        content: "",
        writerId: null,
        writerName: post.UserName,
        boardId: post.boardId,
      }));
      
      setDawnPosts(formattedPosts);
      setDawnPostsTotalPages(pageData.totalPages || 1);
    } catch (error) {
      console.error("새벽예배 게시글 불러오기 실패:", error);
    } finally {
      setDawnPostsLoading(false);
    }
  };

  useEffect(() => {
    loadDawnPosts();
  }, [boardMap["새벽예배"]]);

  const addDawnPost = async ({ title, content, files = [], images = [], boardId }) => {
    
    const targetBoardId = boardId || boardMap["새벽예배"];

    if (!targetBoardId) {
      throw new Error("게시판을 찾을 수 없습니다.");
    }

    try {
      // 수정됨
      let attachmentIds = [];
      if (files && files.length > 0) {
        try {
          const response = await attachmentAPI.uploadFiles(files);
          attachmentIds = response.data.data.map((item) => item.attachmentId);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          throw new Error("파일 업로드에 실패했습니다.");
        }
      }

      const response = await boardAPI.createPost({
        title,
        content,
        boardId: targetBoardId,
        attachmentIds: attachmentIds || [],
        imageIds: images || [],
      });
      await loadDawnPosts();
      return response.data.data;
    } catch (error) {
      console.error("새벽예배 게시글 작성 실패:", error);
      throw error;
    }
  };

  const updateDawnPost = async (id, { title, content, files = [], images = [] }) => {
    try {
      let attachmentIds = [];
      // 수정됨
      if (files && files.length > 0) {
        const newFiles = files.filter(f => f instanceof File);
        if (newFiles.length > 0) {
          const response = await attachmentAPI.uploadFiles(newFiles);
          attachmentIds = response.data.data.map(item => item.attachmentId);
        }
        const existingIds = files
          .filter(f => !(f instanceof File) && (f.id || f.attachmentId))
          .map(f => f.id || f.attachmentId);
        attachmentIds = [...attachmentIds, ...existingIds];
      }
      
      await boardAPI.updatePost(id, { title, content, attachmentIds, imageIds: images });
      await loadDawnPosts();
    } catch (error) {
      console.error("새벽예배 게시글 수정 실패:", error);
      throw error;
    }
  };

  const deleteDawnPost = async (id) => {
    try {
      await boardAPI.deletePost(id);
      setDawnPosts(prev => prev.filter(p => p.id !== id));
      setDawnComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("새벽예배 게시글 삭제 실패:", error);
      throw error;
    }
  };

  return (
    <BoardContext.Provider
      value={{
        // 게시판 목록
        boards,
        boardMap,
        getPost,

        // 1) 자유게시판
        posts,
        postsLoading,
        postsTotalPages,
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

        // 2) 중보기도
        prayerPosts,
        prayerPostsLoading,
        prayerPostsTotalPages,
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

        // 3) 공지사항
        noticePosts,
        noticePostsLoading,
        noticePostsTotalPages,
        loadNoticePosts,
        addNoticePost,
        updateNoticePost,
        deleteNoticePost,
        noticeComments,
        addNoticeComment,
        increaseNoticeViews,

        // 4) 교회소식
        updatePosts,
        updatePostsLoading,
        updatePostsTotalPages,
        loadUpdatePosts,
        addUpdatePost,
        updateUpdatePost,
        deleteUpdatePost,
        updateComments,
        addUpdateComment,
        increaseUpdateViews,

        // 5) 주일예배
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

        // 6) 새벽예배
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
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}