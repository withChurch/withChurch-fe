import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css"; 

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
      const res = await 
      api.post("/auth/login", { loginId, password 
      });
      
      console.log("=== 서버 응답 데이터 확인 ===", res.data.data);

      const { accessToken, refreshToken, userId } = res.data.data;
      login({ accessToken, refreshToken, userId }); 

      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      const msg = err.response?.data?.message || "로그인 중 서버 오류가 발생했습니다.";
      alert(msg);
    }
  };

  // 엔터키 입력 시 로그인 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AuthLayout title="로그인">
      
 

      <div className="login-form-container">
        <div className="login-input-group">
          <input
            type="text"
            className="auth-input"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="login-input-group">
          <input
            type="password"
            className="auth-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <label className="login-save-id">
          <input type="checkbox" />
          <span>아이디 저장</span>
        </label>

        <button type="button" className="btn-primary" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-bottom-links">
          <button className="link-btn" onClick={() => navigate("/signup/agree")}>
            회원가입
          </button>
          
          <span className="link-divider"></span>
          
          <button className="link-btn" onClick={() => navigate("/find-id")}>
            아이디/비밀번호 찾기
          </button>
        </div>
      </div>

    </AuthLayout>
  );
}

export default LoginPage;