// src/pages/Auth/SignupPage.jsx
import React from "react";
import "./SignupPage.css";

function SignupPage() {
  return (
    <div className="signup-page">
      {/* 제목 */}
      <h2 className="signup-title">
        <span className="signup-highlight">with church</span>
        에 오신 걸 환영합니다!
      </h2>

      {/* 연한 파란 카드 */}
      <div className="signup-card">
        <div className="signup-card-header">
          <span className="signup-required-text">✔ 필수 입력</span>
        </div>

        <div className="signup-form">
          {/* 아이디 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">👤</span>
              <span>아이디</span>
            </div>
            <input
              type="text"
              className="signup-input"
              placeholder="아이디"
            />
          </div>

          {/* 비밀번호 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">🔒</span>
              <span>비밀번호</span>
            </div>
            <input
              type="password"
              className="signup-input"
              placeholder="영문/숫자/특수문자 조합 8~15자"
            />
            <div className="signup-help-text">
              공백없는 8~15자의 영문/숫자/특수문자 조합(알파벳+숫자+특문)
            </div>
          </div>

          {/* 비밀번호 재입력 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">🔒</span>
              <span>비밀번호 재입력</span>
            </div>
            <input
              type="password"
              className="signup-input"
              placeholder="비밀번호 재입력"
            />
          </div>

          {/* 이름 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">🧑</span>
              <span>이름</span>
            </div>
            <input
              type="text"
              className="signup-input"
              placeholder="이름"
            />
          </div>

          {/* 휴대폰 번호 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">📱</span>
              <span>휴대폰 번호(숫자만 입력해 주세요)</span>
            </div>
            <input
              type="tel"
              className="signup-input"
              placeholder="예: 01012345678"
            />
            <div className="signup-help-text">
              핸드폰 번호는 withchurch의 중요 안내사항을 SMS로 통지할 수 있습니다.
            </div>
          </div>

          {/* 성별 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">🚻</span>
              <span>성별</span>
            </div>
            <div className="signup-inline">
              <label className="signup-radio">
                <input type="radio" name="gender" /> 남
              </label>
              <label className="signup-radio">
                <input type="radio" name="gender" /> 여
              </label>
            </div>
          </div>

          {/* 이메일 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">✉️</span>
              <span>이메일</span>
            </div>
            <input
              type="email"
              className="signup-input"
              placeholder="이메일"
            />
            <div className="signup-inline signup-email-sub">
              <span>뉴스레터 수신여부</span>
              <label className="signup-radio">
                <input type="radio" name="emailAgree" /> 예
              </label>
              <label className="signup-radio">
                <input type="radio" name="emailAgree" /> 아니오
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="signup-row">
            <div className="signup-label">
              <span className="signup-icon">📅</span>
              <span>생년월일</span>
            </div>
            <div className="signup-birth">
              <select className="signup-select">
                <option>1900</option>
                <option>1990</option>
                <option>2000</option>
                <option>2010</option>
              </select>
              <span className="signup-birth-text">년</span>

              <select className="signup-select">
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
              </select>
              <span className="signup-birth-text">월</span>

              <select className="signup-select">
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
              </select>
              <span className="signup-birth-text">일</span>

              <label className="signup-radio small">
                <input type="radio" name="calendar" /> 양력
              </label>
              <label className="signup-radio small">
                <input type="radio" name="calendar" /> 음력
              </label>
            </div>
          </div>

          {/* 완료 버튼 */}
          <div className="signup-btn-wrap">
            <button className="signup-submit-btn">완료</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
