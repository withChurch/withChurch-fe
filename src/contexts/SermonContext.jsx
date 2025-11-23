// src/contexts/SermonContext.jsx
import { createContext, useContext, useState } from "react";

const SermonContext = createContext();

export function SermonProvider({ children }) {

  const [sermons, setSermons] = useState([
    {
      id: 1,
      category: "주일예배",
      title: "은혜의 해, 보복의 날",
      date: "2025-11-05",
      youtubeId: "L0FQb3RMfPg",
      summary:
        "본문: 이사야 60:1~3, 61:1~3\n오정현 담임목사 – 은혜의 해, 보복의 날 설교 내용 요약",
    },
    {
      id: 2,
      category: "주일예배",
      title: "주께서 나를 붙드시나이다",
      date: "2025-11-04",
      youtubeId: "8XDI2kk6qQU",
      summary: "설교 요약 예시",
    },
    {
      id: 3,
      category: "주일예배",
      title: "주께서 나를 붙드시나이다",
      date: "2025-11-04",
      youtubeId: "LSMCwLqaE_c",
      summary: "설교 요약 예시",
    },
    {
      id: 4,
      category: "주일예배",
      title: "주께서 나를 붙드시나이다",
      date: "2025-11-04",
      youtubeId: "8H1D7XUPNFI",
      summary:
        "설교 요약 예시설교 요약 예시설교 요약 예시설교 요약 예시",
    },
  ]);


  const [dawnSermons, setDawnSermons] = useState([
    {
      id: 1,
      category: "새벽예배",
      title: "새벽예배 설교 제목 예시",
      date: "2025-11-05",
      youtubeId: "EAXDUxVYquY",
      summary: "본문: 시편 23편\n설교자: 홍길동 목사",
    },
  ]);

  const addSermon = (data) => {
    const newSermon = { id: sermons.length + 1, ...data };
    setSermons((prev) => [...prev, newSermon]);
    return newSermon;
  };

  const updateSermon = (id, updatedData) => {
    setSermons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteSermon = (id) => {
    setSermons((prev) => prev.filter((s) => s.id !== id));
  };

  const addDawnSermon = (data) => {
    const newSermon = { id: dawnSermons.length + 1, ...data };
    setDawnSermons((prev) => [...prev, newSermon]);
    return newSermon;
  };

  const updateDawnSermon = (id, updatedData) => {
    setDawnSermons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteDawnSermon = (id) => {
    setDawnSermons((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SermonContext.Provider
      value={{
        sermons,
        addSermon,
        updateSermon,
        deleteSermon,

        dawnSermons,
        addDawnSermon,
        updateDawnSermon,
        deleteDawnSermon,
      }}
    >
      {children}
    </SermonContext.Provider>
  );
}

export const useSermon = () => useContext(SermonContext);
