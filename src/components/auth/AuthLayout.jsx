// src/components/AuthLayout.jsx
import React from "react";
import "./AuthForm.css"; // 위에서 만든 CSS 임포트

// step: 현재 단계 (1, 2, 3)
// title: 큰 제목
// description: 작은 설명
// children: 각 페이지별 내용(form 등)
const AuthLayout = ({ step, title, description, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* 상단 로고 */}
        <h1 className="logo-text">WithChurch</h1>
        <div className="divider-line"></div>

        {/* Step Indicator (자동 상태 관리) */}
        <div className="step-indicator">
          <StepItem number={1} label="이용 약관" currentStep={step} />
          <div className="step-line"></div>
          <StepItem number={2} label="정보 입력" currentStep={step} />
          <div className="step-line"></div>
          <StepItem number={3} label="신청 완료" currentStep={step} />
        </div>

        {/* 페이지 타이틀 */}
        <div className="content-header">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        {/* 페이지별 실제 컨텐츠 */}
        {children}
      </div>
    </div>
  );
};

// 내부에서 쓰는 작은 컴포넌트
function StepItem({ number, label, currentStep }) {
  // 현재 단계인지 확인
  const isActive = currentStep === number;
  // 지나간 단계인지 확인 (원하면 스타일 추가 가능)
  const isCompleted = currentStep > number;

  return (
    <div className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
      <div className={`step-circle ${!isActive && !isCompleted ? "empty" : ""}`}></div>
      <span className="step-text">{number}. {label}</span>
    </div>
  );
}

export default AuthLayout;