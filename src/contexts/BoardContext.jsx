// src/contexts/BoardContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getPosts, getPostById, createPost, deletePostById } from "../api/posts";
import { BOARD_IDS } from "../constants/boards";

const BoardContext = createContext();

export function BoardProvider({ children }) {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [currentPost, setCurrentPost] = useState(null);

  /* ============================
     목록 조회
  ============================ */
  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts(BOARD_IDS.FREE);

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const total = sorted.length;

      setPosts(
        sorted.map((post, index) => ({
          id: post.postId,
          title: post.title,
          content: post.content,
          views: post.viewCount ?? 0,
          createdAt: post.createdAt ? post.createdAt.slice(0, 10) : "",
          writerName: post.UserName ?? "",
          writerId: post.UserId ?? null,
          boardId: post.boardId,
          number: total - index,
        }))
      );
    } catch (e) {
      console.error("자유게시판 게시글 조회 실패", e);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ============================
     상세 조회
  ============================ */
  const fetchPostById = useCallback(async (postId) => {
    try {
      const data = await getPostById(postId);

      setCurrentPost({
        id: data.postId,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt ? data.createdAt.slice(0, 10) : "",
        views: data.viewCount ?? 0,
        writerName: data.UserName ?? "",
        writerId: data.UserId ?? null,
        boardId: data.boardId,
      });
    } catch (e) {
      console.error("게시글 상세 조회 실패", e);
      setCurrentPost(null);
    }
  }, []);

  /* ============================
     글 작성/삭제
  ============================ */
  const addPost = useCallback(
    async ({ title, content }) => {
      await createPost({
        title,
        content,
        boardId: BOARD_IDS.FREE,
      });
      await fetchPosts();
    },
    [fetchPosts]
  );

  const deletePost = useCallback(
    async (id) => {
      await deletePostById(id);
      await fetchPosts();
    },
    [fetchPosts]
  );

  /* ============================
     조회수 (프론트용) ✅
     - postId 기준으로 posts + currentPost 둘 다 증가
  ============================ */
  const increaseViews = useCallback((postId) => {
    if (!postId) return;

    // 목록에서 증가
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, views: (p.views ?? 0) + 1 } : p
      )
    );

    // 상세에서 증가
    setCurrentPost((prev) =>
      prev && prev.id === postId
        ? { ...prev, views: (prev.views ?? 0) + 1 }
        : prev
    );
  }, []);

  /* ============================
     게시글 수정 (프론트 상태용)
  ============================ */
  const updatePost = useCallback((id, { title, content }) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, title, content } : p)));
    setCurrentPost((prev) =>
      prev && prev.id === id ? { ...prev, title, content } : prev
    );
  }, []);

  /* ============================
     댓글 (프론트 임시)
  ============================ */
  const addComment = useCallback(
    (postId, content) => {
      const newComment = {
        id: Date.now(),
        author: user?.name || "익명",
        writerId: user?.id,
        date: new Date().toISOString().split("T")[0],
        content,
        postId,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
      }));
    },
    [user]
  );



  /* ============================================
     2) 중보기도 (prayer)
  ============================================ */
  const [prayerPosts, setPrayerPosts] = useState([
    {
      id: 1,
      title: "중보기도 요청드립니다",
      createdAt: new Date("2025-12-20"),
      views: 0,
      content: "이번 주 수술을 앞두고 있습니다. 기도 부탁드립니다.",
    },
  ]);

  const [prayerComments, setPrayerComments] = useState({});

  const addPrayerPost = ({ title, content, files=[] }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      files,
      views: 0,
      date: new Date().toISOString().split("T")[0],
      writerId: user?.id,
      writerName: user?.name,      
    };
    setPrayerPosts(prev => [newPost, ...prev]);
  };

  const increasePrayerViews = (id) => {
    setPrayerPosts(prev =>
      prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p)
    );
  };

  const addPrayerComment = (postId, content, category) => {
    const newComment = {
      id: Date.now(),
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
      postId,
      category
    };
    setPrayerComments(prev => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment]
    }));
  };

  const updatePrayerPost = (id, { title, content, files=[] }) => {
    setPrayerPosts(prev =>
      prev.map(p => p.id === id ? { ...p, title, content, files} : p)
    );
  };

  const deletePrayerPost = (id) => {
    setPrayerPosts(prev => prev.filter(p => p.id !== id));
    setPrayerComments(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };


  /* ============================================
     3) 공지사항 (notices)
  ============================================ */
  const [noticePosts, setNoticePosts] = useState([
    {
      id: 10,
      title: "2025 성탄예배 안내",
      createdAt: new Date("2025-12-20"),
      views: 302,
      content: "성탄예배 안내 본문은 추후 업데이트 예정입니다.",
    },
    {
      id: 9,
      title: "교회 차량 운행 변경 안내",
      createdAt: new Date("2025-12-20"),
      views: 214,
      content: "교회 차량 운행 변경 관련 상세 내용은 준비 중입니다.",
    },
  ]);

  const [noticeComments, setNoticeComments] = useState({});

  const addNoticePost = ({ title, content,files=[] }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      files,
      views: 0,
      date: new Date().toISOString().split("T")[0],
      writerId: user?.id,
      writerName: user?.name,      
    };
    setNoticePosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const increaseNoticeViews = (id) => {
    setNoticePosts(prev =>
      prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p)
    );
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

  const updateNoticePost = (id, { title, content, files=[] }) => {
    setNoticePosts(prev =>
      prev.map(p => p.id === id ? { ...p, title, content, files } : p)
    );
  };

  const deleteNoticePost = (id) => {
    setNoticePosts(prev => prev.filter(p => p.id !== id));
    setNoticeComments(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };


  /* ============================================
     4) 교회소식 (updates)
  ============================================ */
  const [updatePosts, setUpdatePosts] = useState([
    {
      id: 4,
      title: "교회 중보 기도제목",
      createdAt: new Date("2025-12-20"),
      views: 128,
      content: "중보기도 제목 안내 본문입니다.",
    },
    {
      id: 3,
      title: "10월 19일 주일예배 주보",
      createdAt: new Date("2025-12-20"),
      views: 145,
      content: "주일예배 주보 본문입니다.",
    },
  ]);

  const [updateComments, setUpdateComments] = useState({});

  const addUpdatePost = ({ title, content, files = [] }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      files,
      views: 0,
      date: new Date().toISOString().split("T")[0],
      writerId: user?.id,
      writerName: user?.name,
    };

    setUpdatePosts((prev) => [newPost, ...prev]);

    return newPost;
  };

  const increaseUpdateViews = (id) => {
    setUpdatePosts(prev =>
      prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p)
    );
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

  const updateUpdatePost = (id, { title, content, files=[] }) => {
    setUpdatePosts(prev =>
      prev.map(p => p.id === id ? { ...p, title, content, files } : p)
    );
  };

  const deleteUpdatePost = (id) => {
    setUpdatePosts(prev => prev.filter(p => p.id !== id));
    setUpdateComments(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };


  return (
    <BoardContext.Provider
      value={{

        /* 자유게시판 */
        posts,
        currentPost,
        fetchPostById,
        addPost,
        increaseViews,
        comments,
        setComments,
        addComment,
        updatePost,
        deletePost,

        /* 중보기도 */
        prayerPosts,
        addPrayerPost,
        increasePrayerViews,
        setPrayerComments,
        prayerComments,
        addPrayerComment,
        updatePrayerPost,
        deletePrayerPost,

        /* 공지사항 */
        noticePosts,
        addNoticePost,
        increaseNoticeViews,
        setNoticeComments,
        noticeComments,
        addNoticeComment,
        updateNoticePost,
        deleteNoticePost,

        /* 교회소식 */
        updatePosts,
        addUpdatePost,
        increaseUpdateViews,
        setUpdateComments,
        updateComments,
        addUpdateComment,
        updateUpdatePost,
        deleteUpdatePost,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
