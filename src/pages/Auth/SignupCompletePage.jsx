// src/pages/Auth/SignupCompletePage.jsx
import React from "react";
import "./SignupCompletePage.css";

function SignupCompletePage() {
  return (
    <div className="signup-complete-page">
      <h2 className="signup-complete-title">회원가입을 축하드립니다!</h2>

      {/* 위쪽 그림 영역 (나중에 이미지 넣어도 되고 지금은 배경만 둥글게) */}
      <div className="signup-complete-illustration">
        {/* 실제 이미지 쓰고 싶으면 아래 주석 해제하고, assets에 파일 넣고 경로만 바꿔줘 */}
        {/* <img src={signupCompleteImg} alt="회원가입 완료" /> */}
        <div className="signup-complete-emoji">💒</div>
      </div>

      {/* 파란 카드 영역 */}
      <div className="signup-complete-card">
        <p className="signup-complete-message">
          <span className="highlight">관리자에게 [회원가입 승인요청] 메일이 발송되었습니다.</span>
          <br />
          등록하신 메일로 결과가 전달됩니다. 승인 후 홈페이지를 이용하실 수 있습니다.
        </p>

        <form className="signup-complete-form">
          <div className="input-row">
            <label htmlFor="userId">아이디</label>
            <input id="userId" type="text" placeholder="아이디" />
          </div>
          <div className="input-row">
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호" />
          </div>

          <button type="button" className="signup-complete-button">
            확인
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupCompletePage;
