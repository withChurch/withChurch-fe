import React from "react";
import "./AuthForm.css";

const AuthLayout = ({ step, title, description, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* 로고 */}
        <h1 className="logo-text">WithChurch</h1>
        <div className="divider-line"></div>

        {step && (
          <div className="step-indicator">
            <StepItem stepNumber={1} label="1. 이용 약관" currentStep={step} />
            <div className="step-line"></div>
            <StepItem stepNumber={2} label="2. 정보 입력" currentStep={step} />
            <div className="step-line"></div>
            <StepItem stepNumber={3} label="3. 신청 완료" currentStep={step} />
          </div>
        )}

        {/* 타이틀 영역 */}
        {(title || description) && (
          <div className="content-header" style={{ marginBottom: '20px' }}>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

function StepItem({ stepNumber, label, currentStep }) {
  const isActive = currentStep === stepNumber;
  const isCompleted = currentStep > stepNumber;
  let className = "step-item";
  if (isActive) className += " active";
  if (isCompleted) className += " completed";

  return (
    <div className={className}>
      <div className="step-circle"></div>
      <span className="step-text">{label}</span>
    </div>
  );
}

export default AuthLayout;