import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
 
function SignupAgreePage() {
  const navigate = useNavigate();

  // 개별 체크 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,   // [필수] 서비스 이용약관
    privacy: false, // [필수] 개인정보 수집 및 이용
  });

  // 개별 체크박스 핸들러
  const handleCheck = (name) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 다음 버튼 핸들러
  const handleNextClick = () => {
    // 필수 항목 체크 여부 확인
    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }
    // 통과 시 이동
    navigate("/signup");
  };

  return (
    <AuthLayout
      step={1}
      title="WithChurch 회원가입"
      description="이용 약관에 동의해주세요"
    >
      {/* 약관 리스트 */}
      <div className="agreement-list">
        {/* 1. 필수 약관 */}
        <div 
          className={`agreement-item ${agreements.terms ? "checked" : ""}`}
          onClick={() => handleCheck("terms")}
        >
          <div className="custom-checkbox">
            {agreements.terms && <div className="checkmark"></div>}
          </div>
          <span className="agreement-label">
            <span className="required-tag">[필수]</span> 서비스 이용약관 동의
          </span>
        </div>

        {/* 2. 필수 개인정보 */}
        <div 
          className={`agreement-item ${agreements.privacy ? "checked" : ""}`}
          onClick={() => handleCheck("privacy")}
        >
          <div className="custom-checkbox">
            {agreements.privacy && <div className="checkmark"></div>}
          </div>
          <span className="agreement-label">
            <span className="required-tag">[필수]</span> 개인정보 수집 및 이용동의
          </span>
        </div>

      </div>

      {/* 다음 버튼 (공통 CSS의 btn-primary 사용) */}
      <button className="btn-primary" onClick={handleNextClick}>
        다음
      </button>
    </AuthLayout>
  );
}

export default SignupAgreePage;