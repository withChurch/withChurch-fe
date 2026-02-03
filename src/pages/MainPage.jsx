import React from "react";
import "./MainPage.css";
import Footer from "../components/common/Footer";

import banner from "../assets/mainpg_banner.png";

import { Church, UserPlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">

      <section className="hero-section">
        <img src={banner} alt="main banner" className="hero-image" />
      </section>

      <section className="welcome-section">
        <p className="welcome-desc">
          WELCOME TO 
          WithChurch
        </p>
      </section>

      <section className="quick-menu">
        <div className="qm-item" onClick={() => navigate("/about/greeting")}>
          <Church className="qm-icon" />
          <p className="qm-text">교회소개</p>
        </div>
        <div className="qm-item" onClick={() => navigate("/signup")}>
          <UserPlus className="qm-icon" />
          <p className="qm-text">회원가입</p>
        </div>
        <div className="qm-item" onClick={() => navigate("/location")}>
          <MapPin className="qm-icon" />
          <p className="qm-text">오시는길</p>
        </div>
      </section>

    </div>
  );
};

export default MainPage;
