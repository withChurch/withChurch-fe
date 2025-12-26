// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// ------------------------------
// JWT Decode 함수
// ------------------------------
function decodeToken(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decode 실패:", e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // 로그인
  // ------------------------------------
  const login = ({ accessToken, refreshToken }) => {
    const decoded = decodeToken(accessToken);
    if (!decoded) return;

    setUser({
      id: decoded.sub,
      name: decoded.name,
      role: decoded.role,
      accessToken,
      refreshToken,
    });

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  // ------------------------------------
  // 로그아웃
  // ------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // ------------------------------------
  // 자동 로그인
  // ------------------------------------
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (!savedAccess || !savedRefresh) {
      setLoading(false);
      return;
    }

    const decoded = decodeToken(savedAccess);

    if (decoded) {
      setUser({
        id: decoded.sub,
        name: decoded.name,
        role: decoded.role,
        accessToken: savedAccess,
        refreshToken: savedRefresh,
      });
      setLoading(false);
      return;
    }

    refreshAccessToken(savedRefresh);
  }, []);

  // ------------------------------------
  // refreshToken으로 accessToken 재발급
  // ------------------------------------
  const refreshAccessToken = async (refreshToken) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh?refreshToken=${refreshToken}`
      );

      const newAccess = res.data.data.accessToken;
      const decoded = decodeToken(newAccess);

      setUser({
        id: decoded.sub,
        name: decoded.name,
        role: decoded.role,
        accessToken: newAccess,
        refreshToken,
      });

      localStorage.setItem("accessToken", newAccess);

    } catch (e) {
      // 🔥 핵심 수정: 자동 로그아웃 ❌
      console.warn("토큰 재발급 실패 (자동 로그아웃 안 함)");
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
