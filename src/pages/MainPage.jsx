import React, { useEffect, useMemo, useState } from "react";
import "./MainPage.css";

import banner from "../assets/mainpg_banner.png";
import worshipImg from "../assets/worship.png";

import { Church, PencilLine, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../contexts/BoardContext";
import * as boardAPI from "../api/boardAPI";

const MainPage = () => {
  const navigate = useNavigate();

  const { boardMap } = useBoard();

  const [mainSundayPosts, setMainSundayPosts] = useState([]);

  useEffect(() => {
    const fetchMainSundayPosts = async () => {
      const sundayBoardId =
        boardMap?.["주일예배"] ??
        Object.entries(boardMap || {}).find(([name]) =>
          name.includes("주일예배")
        )?.[1];

      if (!sundayBoardId) return;

      try {
        const res = await boardAPI.getPostsByBoard(sundayBoardId, 0, 10);
        const pageData = res.data.data;
        const postsList = pageData.content || [];

        const formatted = postsList.map((post) => ({
          id: post.postId,
          title: post.title,
          date: post.createdAt ? post.createdAt.split("T")[0] : "",
        }));

        setMainSundayPosts(formatted);
      } catch (e) {
        console.error("메인 주일예배 불러오기 실패:", e);
        setMainSundayPosts([]);
      }
    };

    fetchMainSundayPosts();
  }, [boardMap]);

  const worshipCards = useMemo(() => {
    const source = Array.isArray(mainSundayPosts) ? mainSundayPosts : [];

    return [...source]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        category: "주일예배",
        title: p.title,
        date: p.date ? `주후 ${p.date.replace(/-/g, ".")}` : "",
        link: `/sermon/sunday/${p.id}`,
      }));
  }, [mainSundayPosts]);

  return (
    <div className="main-wrapper">
      <section className="hero-section">
        <img src={banner} alt="main banner" className="hero-image" />
      </section>

      <section className="worship-section">
        <h2 className="worship-title">예배 · 찬양</h2>

        <div className="worship-card-list">
          {worshipCards.length === 0 ? (
            <p style={{ padding: "30px 0", opacity: 0.6 }}>
              주일예배 게시글이 없습니다.
            </p>
          ) : (
            worshipCards.map((card) => (
              <article
                key={card.id}
                className="worship-card"
                onClick={() => navigate(card.link)}
                style={{ cursor: "pointer" }}
              >
                <div className="worship-thumb-wrapper">
                  <img src={worshipImg} alt={card.title} className="worship-thumb" />
                </div>

                <div className="worship-meta">
                  <span className="worship-category">{card.category}</span>
                  <h3 className="worship-card-title">{card.title}</h3>
                  <p className="worship-date">{card.date}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="welcome-quick">
        <div className="welcome-section">
          <p className="welcome-mtitle">
            WELCOME TO
            <br />
            WithChurch
          </p>
        </div>

        <section className="quick-menu">
          <div className="qm-mitem" onClick={() => navigate("/signup/agree")}>
            <PencilLine size={56} className="qm-micon" />
            <p className="qm-mtext">새가족 등록</p>
          </div>
          <div className="qm-mitem" onClick={() => navigate("/about/greeting")}>
            <Church size={56} className="qm-micon" />
            <p className="qm-mtext">교회 소개</p>
          </div>
          <div className="qm-mitem" onClick={() => navigate("/about/location")}>
            <MapPin size={56} className="qm-micon" />
            <p className="qm-mtext">오시는 길</p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default MainPage;

