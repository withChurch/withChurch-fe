// src/common/Navbar.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/image.png";
import { LogIn, UserPlus } from "lucide-react";

const menuItems = [
  {
    name: "교회 소개",
    path: "/about/greeting",
    submenu: [
      { name: "인사말", path: "/about/greeting" },
      { name: "예배 안내", path: "/about/worship-info" },
      { name: "담임목사 소개", path: "/about/pastor" },
      { name: "온라인 헌금", path: "/about/offering" },
    ],
  },
  {
    name: "교회 소식",
    path: "/news/updates",
    submenu: [
      { name: "공지사항", path: "/news/notices" },
      { name: "교회소식", path: "/news/updates" },
    ],
  },
  {
    name: "생명의 말씀",
    path: "/sermon/sunday",
    submenu: [
      { name: "주일예배", path: "/sermon/sunday" },
      { name: "새벽예배", path: "/sermon/dawn" },
    ],
  },
  {
    name: "소통과 공감",
    path: "/community/board",
    submenu: [
      { name: "자유게시판", path: "/community/board" },
      { name: "중보기도", path: "/community/prayer" },
    ],
  },
  {
    name: "오시는 길",
    path: "/about/location",
    submenu: [],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const leaveTimer = useRef(null);

  return (
    <div className="navbar-wrapper">

      {/* 상단 흰색 로고영역 */}
      <div className="navbar-top">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">WithChurch</span>
        </div>

        <div className="navbar-auth">
          <div className="auth-item" onClick={() => navigate("/login")}>
            <LogIn size={26} />
            <span>로그인</span>
          </div>

          <div className="auth-item" onClick={() => navigate("/signup")}>
            <UserPlus size={26} />
            <span>회원가입</span>
          </div>
        </div>
      </div>

      {/* 파란 메뉴바 */}
      <div className="navbar-menu">
        {menuItems.map((menu, index) => (
          <div
            className="menu-item"
            key={index}
            onMouseEnter={() => {
              clearTimeout(leaveTimer.current);
              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              leaveTimer.current = setTimeout(() => {
                setActiveIndex(null);
              }, 120);
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(menu.path);
            }}
          >
            <span>{menu.name}</span>

            {menu.submenu.length > 0 && activeIndex === index && (
              <div
                className="submenu"
                onMouseEnter={() => {
                  clearTimeout(leaveTimer.current);
                  setActiveIndex(index);
                }}
                onMouseLeave={() => {
                  leaveTimer.current = setTimeout(() => {
                    setActiveIndex(null);
                  }, 120);
                }}
              >
                {menu.submenu.map((sub, i) => (
                  <div
                    key={i}
                    className="submenu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(sub.path);
                    }}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Navbar;

