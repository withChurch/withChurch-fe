// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 기반 refresh 등을 쓸 가능성 있으면 true 권장
});

function resolveChurchDomain() {
  const host = window.location.hostname;
  const devChurchDomain = import.meta.env.VITE_CHURCH_DOMAIN;

  // 1) 로컬 개발이면 env로 강제(없으면 host)
  if ((host === "localhost" || host === "127.0.0.1") && devChurchDomain) {
    return devChurchDomain;
  }

  // 2) 배포/실서비스면 현재 접속 도메인을 그대로 사용
  return host;
}

api.interceptors.request.use(
  (config) => {
    config.headers ??= {};

    const domain = resolveChurchDomain();

    // 헤더 세팅 (axios 1.x 호환)
    if (typeof config.headers.set === "function") {
      config.headers.set("X-Church-Domain", domain);
    } else {
      config.headers["X-Church-Domain"] = domain;
    }

    // 토큰 첨부
    const token = localStorage.getItem("accessToken");
    if (token) {
      const raw = token.startsWith("Bearer ") ? token.slice(7) : token;

      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${raw}`);
      } else {
        config.headers.Authorization = `Bearer ${raw}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// (선택) 서버가 Authorization 헤더로 새 access token을 내려주면 자동 갱신
api.interceptors.response.use(
  (response) => {
    const authHeader = response?.headers?.authorization; // axios는 보통 소문자 키로 줌
    if (authHeader && authHeader.startsWith("Bearer ")) {
      localStorage.setItem("accessToken", authHeader.slice(7));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;