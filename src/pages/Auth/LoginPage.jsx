import React from "react";
import "./LoginPage.css";



function LoginPage() {
  return (
    <div className="login-page">
      {/* 제목 */}
      <h1 className="login-title">로그인</h1>

      {/* 연한 파란색 카드 영역 */}
      <div className="login-card">
        <p className="login-warning">
          *보안상 로그인 5회 실패 시 로그인 제한됩니다.
        </p>

        {/* 아이디 입력 */}
        <div className="login-input-group">
          <input
            type="text"
            className="login-input"
            placeholder="아이디"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="login-input-group">
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
          />
        </div>

        {/* 아이디 저장 체크박스 */}
        <label className="login-save-id">
          <input type="checkbox" />
          <span>아이디 저장</span>
        </label>

        {/* 로그인 버튼 */}
        <button className="btn-login">로그인</button>

        {/* 회원가입 / 아이디비번 찾기 버튼 */}
        <div className="login-bottom-buttons">
          <button className="btn-secondary">회원가입</button>
          <button className="btn-secondary">아이디/비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
