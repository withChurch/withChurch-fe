// src/common/Navbar.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useChurchConfig } from "../../contexts/ChurchConfigContext";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { LogOut, User, LogIn, UserPlus, Menu, X, ChevronDown } from "lucide-react";

import logoFallback from "../../assets/withchurch.svg";

const menuItems = [
  {
    name: "교회소개",
    path: "/about/greeting",
    submenu: [
      { name: "인사말", path: "/about/greeting" },
      { name: "예배안내", path: "/about/worship-info" },
      { name: "담임목사 소개", path: "/about/pastor" },
      { name: "온라인 헌금", path: "/about/offering" },
    ],
  },
  {
    name: "교회소식",
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
  const { user, logout } = useAuth();

  const { config, loading } = useChurchConfig();

  const [activeIndex, setActiveIndex] = useState(null);
  const leaveTimer = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const go = (path) => {
    setDrawerOpen(false);
    setActiveIndex(null);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    go("/");
  };

  const { logoUrl, isFallback } = useMemo(() => {
    const img = config?.main?.logoImg;
    return {
      logoUrl: img || logoFallback,
      isFallback: !img,
    };
  }, [config]);

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-row">
          {/*모바일 햄버거 버튼 */}
          <button
            className="navbar-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label="open menu"
          >
            <Menu size={28} />
          </button>

          {/* 로고 */}
          <div className="navbar-logo" onClick={() => go("/")}>
            <img
              className={`navbar-logo-img ${isFallback ? "is-fallback" : ""}`}
              src={logoUrl}
              alt="교회 로고"
              onError={(e) => {
                e.currentTarget.src = logoFallback; // 깨지면 fallback
                e.currentTarget.classList.add("is-fallback");
              }}
            />
          </div>

          {/* 데스크탑 메뉴*/}
          <div className="navbar-menu">
            {menuItems.map((menu, index) => (
              <div
                className="menu-item"
                key={menu.path}
                onMouseEnter={() => {
                  clearTimeout(leaveTimer.current);
                  setActiveIndex(index);
                }}
                onMouseLeave={() => {
                  leaveTimer.current = setTimeout(() => setActiveIndex(null), 120);
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
                      leaveTimer.current = setTimeout(() => setActiveIndex(null), 120);
                    }}
                  >
                    {menu.submenu.map((sub) => (
                      <div
                        key={sub.path}
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

          {/*우측 auth*/}
          <div className="navbar-auth">
            {user ? (
              <>
                <div className="auth-item" onClick={handleLogout}>
                  <LogOut size={22} />
                  <span>로그아웃</span>
                </div>

                <div className="auth-item" onClick={() => go("/profile")}>
                  <User size={22} />
                  <span>프로필</span>
                </div>
              </>
            ) : (
              <>
                <div className="auth-item" onClick={() => go("/login")}>
                  <LogIn size={22} />
                  <span>로그인</span>
                </div>

                <div className="auth-item" onClick={() => go("/signup/agree")}>
                  <UserPlus size={22} />
                  <span>회원가입</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 오버레이 */}
      <div
        className={`nav-overlay ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* 왼쪽 드로어 */}
      <aside className={`nav-drawer ${drawerOpen ? "is-open" : ""}`}>
        <button
          className="drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="close menu"
        >
          <X size={28} />
        </button>

        <div className="drawer-list">
          {menuItems.map((menu, idx) => {
            const hasSub = menu.submenu?.length > 0;
            const expanded = openGroup === idx;

            return (
              <div key={menu.path} className="drawer-group">
                <div className="drawer-row">
                  <button
                    type="button"
                    className="drawer-item"
                    onClick={() => go(menu.path)}
                  >
                    {menu.name}
                  </button>

                  {hasSub && (
                    <button
                      type="button"
                      className={`drawer-chevron ${expanded ? "is-open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenGroup(expanded ? null : idx);
                      }}
                      aria-label="toggle submenu"
                    >
                      <ChevronDown size={20} />
                    </button>
                  )}
                </div>

                {hasSub && (
                  <div className={`drawer-sub ${expanded ? "is-open" : ""}`}>
                    {menu.submenu.map((sub) => (
                      <button
                        type="button"
                        key={sub.path}
                        className="drawer-subitem"
                        onClick={() => go(sub.path)}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="drawer-divider" />

          <div className="drawer-auth">
            {!user ? (
              <>
                <div className="drawer-authitem" onClick={() => go("/login")}>
                  <LogIn size={20} />
                  <span>로그인</span>
                </div>
                <div className="drawer-authitem" onClick={() => go("/signup/agree")}>
                  <UserPlus size={20} />
                  <span>회원가입</span>
                </div>
              </>
            ) : (
              <>
                <div className="drawer-authitem" onClick={() => go("/profile")}>
                  <User size={20} />
                  <span>프로필</span>
                </div>
                <div className="drawer-authitem" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>로그아웃</span>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;