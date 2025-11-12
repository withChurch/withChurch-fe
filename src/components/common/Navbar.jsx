import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">
          <img src="/vite.svg" alt="WithChurch Logo" />
          <span className="logo-text">WithChurch</span>
        </div>
        <div className="navbar-auth">
          <Link to="/login" className="auth-link">로그인</Link>
          <Link to="/signup" className="auth-link">회원가입</Link>
        </div>
      </div>
      <nav className="navbar-menu">
        <Link to="/about/greeting">교회 소개</Link>
        <Link to="/news/notices">교회 소식</Link>
        <Link to="/sermon/sunday">생명의 말씀</Link>
        <Link to="/community/board">소통과 공감</Link>
        <Link to="/about/location">오시는 길</Link>
      </nav>
    </header>
  );
}

export default Navbar;
