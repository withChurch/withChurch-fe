// src/pages/Auth/FindPasswordResultPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./FindPasswordResultPage.css";

function FindPasswordResultPage() {
  const navigate = useNavigate();

  // 실제로는 이전 페이지에서 아이디/이메일을 받아와서 보여줘야 함
  const userId = "TAB1985";
  const email = "TAB1985!@hufs.ac.kr";

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="findpw-result-page">
      {/* 제목 */}
      <h1 className="findpw-result-title">비밀번호 찾기</h1>

      {/* 연한 파란 카드 영역 */}
      <div className="findpw-result-card">
        {/* 체크 아이콘 */}
        <div className="findpw-result-icon">
          <span>✓</span>
        </div>

        {/* 안내 문구 */}
        <p className="findpw-result-main">
          <span className="findpw-result-id">{userId}</span>
          님의 임시비밀번호를
          <br />
          <span className="findpw-result-email">{email}</span>
          로 발송하였습니다.
        </p>

        <p className="findpw-result-sub">
          임시비밀번호로 로그인 후에 비밀번호를 변경하실 수 있습니다.
          <br />
          로그인 후 [정보변경]에서 휴대폰, 이메일 정보를 확인 후 최신정보로 변경해 주세요.
          <br />
          로그인을 하시려면 아래 <strong>“로그인하기”</strong> 버튼을 클릭해 주세요.
        </p>

        {/* 버튼 */}
        <div className="findpw-result-btn-wrap">
          <button className="findpw-result-btn" onClick={handleGoLogin}>
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FindPasswordResultPage;
