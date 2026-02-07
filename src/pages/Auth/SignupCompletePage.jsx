import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout"; // 경로 주의

// 체크 아이콘 (SVG) - 여기서 viewBox만 남기고 className은 아래에서 제어해도 됩니다.
const BigCheckIcon = () => (
  <svg 
    className="success-icon-svg" 
    viewBox="0 0 23 23" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20 6L9 17L4 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
    />
  </svg>
);

function SignupCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || "성도";

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <AuthLayout step={3}>
      
      {/* ▼▼▼ [핵심 수정] area로 감싸서 영역 확보 ▼▼▼ */}
      <div className="success-icon-area">
        <BigCheckIcon />
      </div>
      {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

      <h2 className="welcome-title">
        회원가입을 축하드립니다!
      </h2>
      <p className="welcome-sub">
        <span className="user-name-highlight">{userName}</span>님, 환영합니다.
      </p>

      <div className="approval-box">
        <span className="approval-title">[ 회원가입 승인 안내 ]</span>
        <p className="approval-desc">
          관리자 승인 후 홈페이지 이용이 가능합니다.<br />
          가입 승인 결과는 입력하신 이메일로 발송됩니다.
        </p>
      </div>

      <button className="btn-primary" onClick={handleHomeClick}>
        메인으로 돌아가기
      </button>

    </AuthLayout>
  );
}

export default SignupCompletePage;