import React from "react";
import "./MainPage.css";
import heroImg from "../assets/hero.png";
import { Church, UserPlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">

      <section className="hero-section">
        <img src={heroImg} alt="banner" className="hero-image" />
      </section>

      <section className="welcome-section">
        <h2 className="welcome-title">Welcome</h2>
        <p className="welcome-desc">
          With Church에 오신 여러분을 축복하고 환영합니다.
        </p>
      </section>

      <section className="quick-menu">

        <div
          className="qm-item"
          onClick={() => navigate("/about/greeting")}
        >
          <Church className="qm-icon" />
          <p className="qm-text">교회소개</p>
        </div>

        <div
          className="qm-item"
          onClick={() => navigate("/signup")}
        >
          <UserPlus className="qm-icon" />
          <p className="qm-text">회원가입</p>
        </div>

        <div
          className="qm-item"
          onClick={() => navigate("/location")}
        >
          <MapPin className="qm-icon" />
          <p className="qm-text">오시는 길</p>
        </div>

      </section>

      <footer className="footer">
        <div className="footer-text">
          WithChurch  
          <br />
          서울 종로구 종로서 00길 12 TEL: 02-1234-1234 &nbsp; FAX: 02-123-1234  
          <br />
          ⓒCopyright2025 WithChurch All Right Reserved  
          <br />
          Programmed by @WithTeam
        </div>
      </footer>

    </div>
  );
};

export default MainPage;
