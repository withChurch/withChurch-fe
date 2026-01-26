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
  // 로그인 (수정됨: userId 포함)
  // ------------------------------------
  // data 객체는 { accessToken, refreshToken, userId } 를 받아야 합니다.
  const login = (data) => {
    const { accessToken, refreshToken, userId } = data;
    
    const decoded = decodeToken(accessToken);
    if (!decoded) return;

    // 상태 업데이트: userId를 숫자로 변환해서 저장
    setUser({
      id: decoded.sub,       // 로그인 아이디 (예: admin)
      userId: Number(userId), // ★ 핵심: DB의 숫자 ID (예: 3)
      name: decoded.name,
      role: decoded.role,
      accessToken,
      refreshToken,
    });

    // 로컬 스토리지 저장 (새로고침 대비)
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (userId) {
      localStorage.setItem("userId", userId); // ★ userId도 따로 저장
    }
  };

  // ------------------------------------
  // 로그아웃
  // ------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId"); // ★ 삭제 추가
  };

  // ------------------------------------
  // 자동 로그인 (새로고침 시)
  // ------------------------------------
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");
    const savedUserId = localStorage.getItem("userId"); // ★ 불러오기

    if (!savedAccess || !savedRefresh) {
      setLoading(false);
      return;
    }

    const decoded = decodeToken(savedAccess);

    if (decoded) {
      setUser({
        id: decoded.sub,
        userId: Number(savedUserId) || 0, // ★ 저장된 ID 복구 (없으면 0)
        name: decoded.name,
        role: decoded.role,
        accessToken: savedAccess,
        refreshToken: savedRefresh,
      });
      setLoading(false);
      return;
    }

    // 토큰 만료 시 갱신 시도
    refreshAccessToken(savedRefresh, savedUserId);
  }, []);

  // ------------------------------------
  // refreshToken으로 accessToken 재발급
  // ------------------------------------
  const refreshAccessToken = async (refreshToken, savedUserId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh?refreshToken=${refreshToken}`
      );

      const newAccess = res.data.data.accessToken;
      const decoded = decodeToken(newAccess);

      setUser({
        id: decoded.sub,
        userId: Number(savedUserId) || 0, // ★ 재발급 때도 ID 유지
        name: decoded.name,
        role: decoded.role,
        accessToken: newAccess,
        refreshToken,
      });

      localStorage.setItem("accessToken", newAccess);

    } catch (e) {
      console.warn("토큰 재발급 실패 (자동 로그아웃 안 함)");
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
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