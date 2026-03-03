import React, { createContext, useContext, useEffect, useState } from "react";
import { getChurchConfig } from "../api/churchconfig";

const ChurchConfigContext = createContext(null);

export function ChurchConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);

  //const domain =
    //window.location.hostname === "localhost"
      //? "withchurch.site"
      //: window.location.hostname;

  const domain = window.location.hostname;

    try {
      const data = await getChurchConfig();
      setConfig(data);
    } catch (e) {
      console.error("교회 설정 불러오기 실패:", e?.response?.data || e);
      if (e?.response?.status === 404 || e?.response?.data?.code === "CHURCH_NOT_FOUND") {
        setError("NOT_FOUND");
      } else {
        setError("ERROR");
      }
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error === "NOT_FOUND") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb', color: '#333' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>접근할 수 없는 주소입니다</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>존재하지 않거나 등록되지 않은 교회 도메인입니다.</p>
        <p style={{ fontSize: '1rem', color: '#999', marginTop: '0.5rem' }}>입력하신 인터넷 주소(URL)를 다시 한번 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <ChurchConfigContext.Provider value={{ config, loading, reload: load }}>
      {children}
    </ChurchConfigContext.Provider>
  );
}

export function useChurchConfig() {
  const ctx = useContext(ChurchConfigContext);
  if (!ctx) throw new Error("useChurchConfig must be used within ChurchConfigProvider");
  return ctx;
}