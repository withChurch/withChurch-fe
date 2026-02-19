import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function SignupCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = useMemo(() => {
    return (
      location.state?.userName ||
      sessionStorage.getItem("signupUserName") ||
      "성도"
    );
  }, [location.state]);

  useEffect(() => {
    if (location.state?.userName) {
      sessionStorage.setItem("signupUserName", location.state.userName);
    }
  }, [location.state]);

  const handleLoginClick = () => {
    sessionStorage.removeItem("signupUserName");
    navigate("/login");
  };

  return (
    <AuthLayout step={3}>
      <div className="success-icon-area">
        <div className="success-icon-bg">
          <BigCheckIcon />
        </div>
      </div>

      <h2 className="welcome-title">회원가입이 완료되었습니다!</h2>

      <p className="welcome-sub">
        <span className="user-name-highlight">{userName}</span>님, 환영합니다.
        <br />
        이제 WithChurch의 모든 서비스를 이용하실 수 있습니다.
      </p>

      <button
        className="btn-primary btn-full-width mt-large"
        onClick={handleLoginClick}
      >
        로그인하러 가기
      </button>
    </AuthLayout>
  );
}

export default SignupCompletePage;
