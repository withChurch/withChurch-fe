import React, { createContext, useContext, useEffect, useState } from "react";
import { getChurchConfig } from "../api/churchconfig";

const ChurchConfigContext = createContext(null);

export function ChurchConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const domain =
      import.meta.env.MODE === "development"
        ? "withchurch.site"
        : window.location.hostname;

    try {
      const data = await getChurchConfig(domain);
      setConfig(data);
    } catch (e) {
      console.error("교회 설정 불러오기 실패:", e?.response?.data || e);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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