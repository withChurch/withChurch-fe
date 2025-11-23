// src/pages/Auth/FindIdPage.jsx
import React from "react";
import "./FindIdPage.css";
import { useNavigate } from "react-router-dom";

function FindIdPage() {
  const navigate = useNavigate();

  const handleFindId = () => {
    navigate("/find-id/result");
  };

  const handleFindPassword = () => {
    navigate("/find-password/result");
  };

  return (
    <div className="find-page">
      {/* 아이디 찾기 섹션 */}
      <section className="find-section">
        <h2 className="find-section-title">아이디 찾기</h2>
        <p className="find-section-desc">
          회원정보에 등록된 정보로 가입여부를 확인하실 수 있습니다.
          <br />
          이름, 생년월일을 입력하시고, ‘확인’을 클릭하세요.
        </p>

        <div className="find-card">
          <div className="find-input-wrap">
            <input
              type="text"
              className="find-input"
              placeholder="이름"
            />
          </div>
          <div className="find-input-wrap">
            <input
              type="text"
              className="find-input"
              placeholder="생년월일 (예: 19880706)"
            />
          </div>

          <div className="find-btn-wrap">
          
            <button className="find-btn" onClick={handleFindId}>
              확인
            </button>
          </div>
        </div>
      </section>

      {/* 비밀번호 찾기 섹션 */}
      <section className="find-section">
        <h2 className="find-section-title">비밀번호 찾기</h2>
        <p className="find-section-desc">
          회원정보에 등록된 이름, 아이디, 생년월일을 입력하시면,
          <br />
          암호화 된 임시비밀번호를 발급해 드리며, 로그인 후 비밀번호를 변경 가능합니다.
        </p>

        <div className="find-card">
          <div className="find-input-wrap">
            <input
              type="text"
              className="find-input"
              placeholder="이름"
            />
          </div>
          <div className="find-input-wrap">
            <input
              type="text"
              className="find-input"
              placeholder="아이디"
            />
          </div>
          <div className="find-input-wrap">
            <input
              type="text"
              className="find-input"
              placeholder="생년월일 (예: 19880706)"
            />
          </div>

          <div className="find-btn-wrap">
            
            <button className="find-btn" onClick={handleFindPassword}>
              확인
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FindIdPage;
