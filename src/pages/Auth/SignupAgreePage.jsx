// src/pages/Auth/SignupAgreePage.jsx
import React from "react";
import "./SignupAgreePage.css";

function SignupAgreePage() {
  return (
    <div className="signup-agree-page">
      {/* 제목 */}
      <h1 className="signup-agree-title">
        <span className="highlight">with church</span>
        에 오신 걸 환영합니다!
      </h1>

      {/* 연한 파란 카드 박스 */}
      <div className="signup-agree-card">
        {/* 전체 동의하기 */}
        <div className="agree-row">
          <label className="agree-check">
            <input type="checkbox" />
            <span className="agree-check-label">전체 동의하기</span>
          </label>
        </div>

        {/* 구분선 */}
        <div className="agree-divider" />

        {/* 이용약관 */}
        <div className="agree-section">
          <div className="agree-section-header">
            <span className="agree-required">[필수]</span>
            <span>이용약관</span>
          </div>
          <div className="agree-content-box">
            {/* 나중에 진짜 약관 텍스트 들어갈 자리 */}
          </div>
        </div>

        {/* 개인정보 수집 및 이용에 대한 안내 */}
        <div className="agree-section">
          <div className="agree-section-header">
            <span className="agree-required">[필수]</span>
            <span>개인정보 수집 및 이용에 대한 안내</span>
          </div>
          <div className="agree-content-box">
            {/* 내용 자리 */}
          </div>
        </div>

        {/* 개인정보 취급 위탁 */}
        <div className="agree-section">
          <div className="agree-section-header">
            <span className="agree-required">[필수]</span>
            <span>개인정보 취급 위탁</span>
          </div>
          <div className="agree-content-box">
            {/* 내용 자리 */}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="agree-button-wrap">
          <button className="btn-next">다음</button>
        </div>
      </div>
    </div>
  );
}

export default SignupAgreePage;
