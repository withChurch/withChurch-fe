// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const STORAGE = {
  access: "accessToken",
  refresh: "refreshToken",
  userName: "userName",
};

// ------------
// JWT Decode 함수
// ---------------
function decodeToken(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decode 실패:", e);
    return null;
  }
}

function isExpired(decoded, leewaySeconds = 10) {
  if (!decoded?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now + leewaySeconds;
}

function pickDisplayName(decoded) {
  const cached = localStorage.getItem(STORAGE.userName);

  const fromDecoded =
    decoded?.name ||
    decoded?.userName ||
    decoded?.UserName ||
    decoded?.nickname ||
    decoded?.nickName;

  return (
    (cached && cached.trim()) ||
    (fromDecoded && String(fromDecoded).trim()) ||
    (decoded?.sub && String(decoded.sub).trim()) ||
    "사용자"
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const accessToken = localStorage.getItem(STORAGE.access);
    const refreshToken = localStorage.getItem(STORAGE.refresh);
    if (!accessToken || !refreshToken) return null;

    const decoded = decodeToken(accessToken);
    if (!decoded) return null;

    return {
      id: decoded.sub,
      username: decoded.sub,
      userId: Number(decoded.userId ?? 0),
      name: pickDisplayName(decoded),
      role: decoded.role,
      accessToken,
      refreshToken,
    };
  });

  const [loading, setLoading] = useState(true);

  const saveTokens = useCallback((accessToken, refreshToken) => {
    localStorage.setItem(STORAGE.access, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE.refresh, refreshToken);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE.access);
    localStorage.removeItem(STORAGE.refresh);
    localStorage.removeItem(STORAGE.userName);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStorage();
    setLoading(false);
  }, [clearStorage]);

  const setUserFromTokens = useCallback((accessToken, refreshToken, extra = {}) => {
    const decoded = decodeToken(accessToken);
    if (!decoded) return null;

    const name =
      (extra.name && String(extra.name).trim()) || pickDisplayName(decoded);

    if (name) localStorage.setItem(STORAGE.userName, name);

    const next = {
      id: decoded.sub,
      username: decoded.sub,
      userId: Number(decoded.userId ?? 0),
      name,
      role: decoded.role,
      accessToken,
      refreshToken,
      ...extra,
    };

    setUser(next);
    return next;
  }, []);

  const refreshAccessToken = useCallback(
    async (refreshToken) => {
      const res = await api.post("/auth/refresh", null, {
        params: { refreshToken },
      });

      const data = res?.data?.data ?? res?.data;
      const newAccess = data?.accessToken;
      const newRefresh = data?.refreshToken || refreshToken;

      if (!newAccess) throw new Error("refresh 응답에 accessToken이 없습니다.");

      saveTokens(newAccess, newRefresh);
      setUserFromTokens(newAccess, newRefresh);
      return newAccess;
    },
    [saveTokens, setUserFromTokens]
  );

  const syncMyProfile = useCallback(async () => {
    if (!localStorage.getItem(STORAGE.access)) return;

    const endpoints = ["/users/me", "/auth/me"]; // <-- 둘 중 하나가 실제로 존재하면 됨

    for (const url of endpoints) {
      try {
        const res = await api.get(url);
        const me = res?.data?.data ?? res?.data;
        if (!me) continue;

        const fetchedName =
          me.userName || me.UserName || me.name || me.Name || me.nickname || me.nickName;

        const fetchedUserId = me.userId ?? me.id;

        if (fetchedName) localStorage.setItem(STORAGE.userName, fetchedName);

        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            name: fetchedName ?? prev.name,
            userId: fetchedUserId != null ? Number(fetchedUserId) : prev.userId,
            role: me.role ?? prev.role,
          };
        });

        return; // 성공하면 종료
      } catch (e) {
        // 실패하면 다음 endpoint로
      }
    }
  }, []);

  // ------------------------------------
  // 로그인
  // ------------------------------------
  const login = useCallback(
    (data) => {
      const { accessToken, refreshToken } = data || {};
      if (!accessToken || !refreshToken) {
        console.warn("login data에 토큰이 없습니다.");
        return;
      }

      saveTokens(accessToken, refreshToken);

      const nameFromResponse = data.userName || data.UserName || data.name;

      setUserFromTokens(accessToken, refreshToken, { name: nameFromResponse });

      syncMyProfile().catch(() => {});
    },
    [saveTokens, setUserFromTokens, syncMyProfile]
  );

  // ------------------------------------
  // 자동 로그인 (새로고침 시)
  // ------------------------------------
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const savedAccess = localStorage.getItem(STORAGE.access);
        const savedRefresh = localStorage.getItem(STORAGE.refresh);

        if (!savedAccess || !savedRefresh) {
          if (!cancelled) setUser(null);
          return;
        }

        const decoded = decodeToken(savedAccess);

        if (!decoded || isExpired(decoded)) {
          await refreshAccessToken(savedRefresh);
        } else {
          if (!cancelled) setUserFromTokens(savedAccess, savedRefresh);
        }

        await syncMyProfile();
      } catch (e) {
        console.warn("자동 로그인/토큰 갱신 실패:", e);
        if (!cancelled) {
          clearStorage();
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [refreshAccessToken, setUserFromTokens, syncMyProfile, clearStorage]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshAccessToken,
    }),
    [user, loading, login, logout, refreshAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}