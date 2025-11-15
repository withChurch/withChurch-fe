import { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export function BoardProvider({ children }) {
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
    {
      id: 3,
      title: "학습 / 세례 / 입교식 예고",
      date: "2025-10-28",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
    {
      id: 4,
      title: "교회 셔틀버스 운영안내",
      date: "2025-10-20",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
    {
      id: 5,
      title: "주일예배 광고 안내",
      date: "2025-10-12",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
    {
      id: 6,
      title: "성경 공부반 모집",
      date: "2025-10-01",
      views: 0,
      content: "기존 임시 상세페이지 내용",
      isTemp: true,
    },
  ]);

  const addPost = ({ title, content }) => {
    const newPost = {
      id: Date.now(),
      title,
      content,
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };

    // 기존 글 뒤에 추가 (push 효과)
    setPosts((prev) => [newPost, ...prev]);
    };

  const increaseViews = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  };

  return (
    <BoardContext.Provider value={{ posts, addPost, increaseViews }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
