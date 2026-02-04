import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          loginId,
          password,
        },
      );
      console.log("=== 서버 응답 데이터 확인 ===", res.data.data);

      console.log("로그인 성공:", res.data);
      
      // ▼ 수정된 부분: accessToken, refreshToken, userId를 한 번에 꺼냅니다.
      const { accessToken, refreshToken, userId } = res.data.data;

      // ▼ 수정된 부분: 위에서 꺼낸 변수들을 모두 전달합니다.
      login({ accessToken, refreshToken, userId }); 

      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
        if (err.response) {
        console.error("서버 응답 data:", err.response.data);
        console.error("서버 메시지:", err.response.data?.message);
      }
      alert(
        err.response?.data?.message ??
        "로그인 중 서버 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>

      <div className="login-card">
        <p className="login-warning">
          *보안상 로그인 5회 실패 시 로그인 제한됩니다.
        </p>

        <div className="login-input-group">
          <input
            type="text"
            className="login-input"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>

        <div className="login-input-group">
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="login-save-id">
          <input type="checkbox" />
          <span>아이디 저장</span>
        </label>

        <button type="button" className="btn-login" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-bottom-buttons">
          <button className="btn-secondary" onClick={() => navigate("/signup/agree")}>
            회원가입
          </button>
          <button className="btn-secondary" onClick={() => navigate("/find-id")}>
            아이디/비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
