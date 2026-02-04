import React from "react";
import "./MainPage.css";

import banner from "../assets/mainpg_banner.png";
import worshipImg from "../assets/worship.png";

import { Church, PencilLine, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSermon } from "../contexts/SermonContext";

const MainPage = () => {
  const navigate = useNavigate();

  const { sermons } = useSermon();

  const worshipCards = [...sermons]
    .filter((s) => s.category === "주일예배")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map((s) => ({
      id: s.id,
      category: s.category,
      title: s.title,
      date: s.date ? `주후 ${s.date.replace(/-/g, ".")}` : "",
      link: `/sermon/sunday/${s.id}`,
    }));

  return (
    <div className="main-wrapper">
      <section className="hero-section">
        <img src={banner} alt="main banner" className="hero-image" />
      </section>

      <section className="worship-section">
        <h2 className="worship-title">예배 · 찬양</h2>

        <div className="worship-card-list">
          {worshipCards.map((card) => (
            <article
              key={card.id}
              className="worship-card"
              onClick={() => navigate(card.link)}
              style={{ cursor: "pointer" }}
            >
              <div className="worship-thumb-wrapper">
                <img
                  src={worshipImg}
                  alt={card.title}
                  className="worship-thumb"
                />
              </div>

              <div className="worship-meta">
                <span className="worship-category">{card.category}</span>
                <h3 className="worship-card-title">{card.title}</h3>
                <p className="worship-date">{card.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="welcome-quick">
        <div className="welcome-section">
          <p className="welcome-title">
            WELCOME TO
            <br />
            WithChurch
          </p>
        </div>

        <section className="quick-menu">
          <div className="qm-item" onClick={() => navigate("/signup/agree")}>
            <PencilLine className="qm-icon" />
            <p className="qm-text">새가족 등록</p>
          </div>
          <div className="qm-item" onClick={() => navigate("/about/greeting")}>
            <Church className="qm-icon" />
            <p className="qm-text">교회 소개</p>
          </div>
          <div className="qm-item" onClick={() => navigate("/about/location")}>
            <MapPin className="qm-icon" />
            <p className="qm-text">오시는 길</p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default MainPage;
