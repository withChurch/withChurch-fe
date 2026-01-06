// src/pages/Auth/FindIdResultPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./FindIdResultPage.css";

function FindIdResultPage() {
  const navigate = useNavigate();

  const foundId = "TAB1985";

  const handleGoLogin = () => {
    navigate("/login");
  };

  const handleGoFindPassword = () => {
    navigate("/find-id");   // ← 아이디/비밀번호 찾기 페이지로 이동
  };

  return (
    <div className="findid-result-page">
      <h1 className="findid-result-title">아이디 찾기</h1>

      <div className="findid-result-card">
        <div className="findid-result-icon">
          <span>✓</span>
        </div>

        <p className="findid-result-text">
          회원님의 아이디는{" "}
          <span className="findid-result-id">{foundId}</span> 입니다.
        </p>

        <p className="findid-result-subtext">
          비밀번호를 분실하신 분은 아래 <strong>“비밀번호 찾기”</strong> 버튼을 클릭하세요.
        </p>

        <div className="findid-result-buttons">
          <button className="btn-primary" onClick={handleGoLogin}>
            로그인하기
          </button>

          <button className="btn-gray" onClick={handleGoFindPassword}>
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FindIdResultPage;
