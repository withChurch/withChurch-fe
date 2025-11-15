// src/contexts/BoardContext.jsx
import { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export function BoardProvider({ children }) {
  /** =============================
   *  1) 자유게시판 (board)
   *  ============================= */
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "With Church 유튜브 구독 방법",
      date: "2025-11-02",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
    {
      id: 2,
      title: "추수감사절 예배안내",
      date: "2025-11-01",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
  ]);

  const [comments, setComments] = useState({});

  const addPost = ({ title, content }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const increaseViews = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  };

  const addComment = (postId, content) => {
    const newComment = {
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
    }));
  };

  /** =============================
   *  2) 중보기도 (prayer)
   *  ============================= */
  const [prayerPosts, setPrayerPosts] = useState([
    {
      id: 1,
      title: "중보기도 요청드립니다",
      date: "2025-11-03",
      views: 0,
      content: "이번 주 수술을 앞두고 있습니다. 기도 부탁드립니다.",
    },
  ]);

  const [prayerComments, setPrayerComments] = useState({});

  const addPrayerPost = ({ title, content }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setPrayerPosts((prev) => [newPost, ...prev]);
  };

  const increasePrayerViews = (id) => {
    setPrayerPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  };

  const addPrayerComment = (postId, content) => {
    const newComment = {
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setPrayerComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
    }));
  };

  /** =============================
   *  3) 공지사항 (notices)
   *  ============================= */
  const [noticePosts, setNoticePosts] = useState([
    {
      id: 10,
      title: "2025 성탄예배 안내",
      date: "2025-12-20",
      views: 302,
      content: "성탄예배 안내 본문은 추후 업데이트 예정입니다.",
    },
    {
      id: 9,
      title: "교회 차량 운행 변경 안내",
      date: "2025-12-10",
      views: 214,
      content: "교회 차량 운행 변경 관련 상세 내용은 준비 중입니다.",
    },
    {
      id: 8,
      title: "겨울 수련회 일정 공지",
      date: "2025-12-02",
      views: 189,
      content: "겨울 수련회 관련 상세 내용은 추후 공지됩니다.",
    },
    {
      id: 7,
      title: "홈페이지 전면 개편 안내",
      date: "2025-11-20",
      views: 421,
      content: "홈페이지 개편에 따른 사용 안내는 추후 공지됩니다.",
    },
  ]);

  const [noticeComments, setNoticeComments] = useState({});

  const addNoticePost = ({ title, content }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setNoticePosts((prev) => [newPost, ...prev]);
  };

  const increaseNoticeViews = (id) => {
    setNoticePosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  };

  const addNoticeComment = (postId, content) => {
    const newComment = {
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setNoticeComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
    }));
  };

  /** =============================
   *  4) 교회소식 (updates)
   *  ============================= */
  const [updatePosts, setUpdatePosts] = useState([
    {
      id: 4,
      title: "교회 중보 기도제목",
      date: "2025-10-26",
      views: 128,
      content: "중보기도 제목 안내 본문입니다.",
    },
    {
      id: 3,
      title: "10월 19일 주일예배 주보",
      date: "2025-10-19",
      views: 145,
      content: "주일예배 주보 본문입니다.",
    },
    {
      id: 2,
      title: "10월 12일 주일예배 주보",
      date: "2025-10-12",
      views: 210,
      content: "주일예배 주보 본문입니다.",
    },
    {
      id: 1,
      title: "어린이 여름성경학교",
      date: "2025-08-17",
      views: 223,
      content: "어린이 여름성경학교 본문입니다.",
    },
  ]);

  const [updateComments, setUpdateComments] = useState({});

  const addUpdatePost = ({ title, content }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setUpdatePosts((prev) => [newPost, ...prev]);
  };

  const increaseUpdateViews = (id) => {
    setUpdatePosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  };

  const addUpdateComment = (postId, content) => {
    const newComment = {
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      content,
    };
    setUpdateComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
    }));
  };

  return (
    <BoardContext.Provider
      value={{
        /** 자유게시판 */
        posts,
        addPost,
        increaseViews,
        comments,
        addComment,

        /** 중보기도 */
        prayerPosts,
        addPrayerPost,
        increasePrayerViews,
        prayerComments,
        addPrayerComment,

        /** 공지사항 */
        noticePosts,
        addNoticePost,
        increaseNoticeViews,
        noticeComments,
        addNoticeComment,

        /** 교회소식! */
        updatePosts,
        addUpdatePost,
        increaseUpdateViews,
        updateComments,
        addUpdateComment,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
