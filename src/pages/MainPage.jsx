import React, { useState, useEffect, useRef } from "react";
import "./MainPage.css";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

import { Church, UserPlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const original = [banner2, banner1, banner3];

const banners = [original[original.length - 1], ...original, original[0]];

const MainPage = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(1);
  const trackRef = useRef(null);

  const next = () => {
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (index === banners.length - 1) {
      trackRef.current.style.transition = "none";
      setIndex(1);
      setTimeout(() => {
        trackRef.current.style.transition = "transform 0.7s ease";
      }, 20);
    }

    if (index === 0) {
      trackRef.current.style.transition = "none";
      setIndex(banners.length - 2);
      setTimeout(() => {
        trackRef.current.style.transition = "transform 0.7s ease";
      }, 20);
    }
  };

  useEffect(() => {
    const auto = setInterval(next, 5000);
    return () => clearInterval(auto);
  }, []);

  return (
    <div className="main-wrapper">

      <section className="hero-section">

        <button className="arrow-btn arrow-left" onClick={prev}>
          <span className="arrow-part part-top"></span>
          <span className="arrow-part part-bottom"></span>
        </button>

        <div className="slider-window">
          <div
            className="slider-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: "transform 0.7s ease",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {banners.map((src, i) => (
              <img key={i} src={src} className="hero-slide" />
            ))}
          </div>
        </div>

        <button className="arrow-btn arrow-right" onClick={next}>
          <span className="arrow-part part-top"></span>
          <span className="arrow-part part-bottom"></span>
        </button>

        <div className="indicator-wrap">
          {original.map((_, i) => (
            <div
              key={i}
              className={`dot ${index === i + 1 ? "active" : ""}`}
              onClick={() => setIndex(i + 1)}
            />
          ))}
        </div>

      </section>

      <section className="welcome-section">
        <h2 className="welcome-title">Welcome</h2>
        <p className="welcome-desc">
          With Church에 오신 여러분을 축복하고 환영합니다.
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
          <p className="qm-text">오시는 길</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-text">
          WithChurch  
          <br />서울 종로구 종로서 00길 12 TEL: 02-1234-1234  
          <br />ⓒCopyright2025 WithChurch All Right Reserved  
          <br />Programmed by @WithTeam
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
