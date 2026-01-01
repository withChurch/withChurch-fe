// src/common/Navbar.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useBoard } from "../../contexts/BoardContext";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/image.png";
import { LogOut, User, LogIn, UserPlus } from "lucide-react";

// 게시판 이름과 경로 매핑
const boardPathMap = {
  "자유게시판": "/community/board",
  "중보기도": "/community/prayer",
  "공지사항": "/news/notices",
  "교회소식": "/news/updates",
};

const staticMenuItems = [
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
    name: "생명의 말씀",
    path: "/sermon/sunday",
    submenu: [
      { name: "주일예배", path: "/sermon/sunday" },
      { name: "새벽예배", path: "/sermon/dawn" },
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
  const { boards } = useBoard();
  const [activeIndex, setActiveIndex] = useState(null);
  const leaveTimer = useRef(null);
  const [menuItems, setMenuItems] = useState(staticMenuItems);

  // 게시판 목록을 기반으로 메뉴 동적 생성
  useEffect(() => {
    const newsBoards = boards.filter(
      (board) => board.name === "공지사항" || board.name === "교회소식"
    );
    const communityBoards = boards.filter(
      (board) => board.name === "자유게시판" || board.name === "중보기도"
    );

    const newMenuItems = [...staticMenuItems];

    // 교회 소식 메뉴
    if (newsBoards.length > 0) {
      const newsIndex = newMenuItems.findIndex((item) => item.name === "교회 소식");
      if (newsIndex === -1) {
        // 교회 소식 메뉴가 없으면 추가
        newMenuItems.splice(1, 0, {
          name: "교회 소식",
          path: "/news/updates",
          submenu: newsBoards
            .sort((a, b) => {
              // 공지사항이 먼저 오도록
              if (a.name === "공지사항") return -1;
              if (b.name === "공지사항") return 1;
              return 0;
            })
            .map((board) => ({
              name: board.name,
              path: boardPathMap[board.name] || `/news/${board.name}`,
            })),
        });
      } else {
        // 교회 소식 메뉴가 있으면 업데이트
        newMenuItems[newsIndex].submenu = newsBoards
          .sort((a, b) => {
            if (a.name === "공지사항") return -1;
            if (b.name === "공지사항") return 1;
            return 0;
          })
          .map((board) => ({
            name: board.name,
            path: boardPathMap[board.name] || `/news/${board.name}`,
          }));
      }
    }

    // 소통과 공감 메뉴
    if (communityBoards.length > 0) {
      const communityIndex = newMenuItems.findIndex((item) => item.name === "소통과 공감");
      if (communityIndex === -1) {
        // 소통과 공감 메뉴가 없으면 추가
        newMenuItems.splice(-1, 0, {
          name: "소통과 공감",
          path: "/community/board",
          submenu: communityBoards
            .sort((a, b) => {
              // 자유게시판이 먼저 오도록
              if (a.name === "자유게시판") return -1;
              if (b.name === "자유게시판") return 1;
              return 0;
            })
            .map((board) => ({
              name: board.name,
              path: boardPathMap[board.name] || `/community/${board.name}`,
            })),
        });
      } else {
        // 소통과 공감 메뉴가 있으면 업데이트
        newMenuItems[communityIndex].submenu = communityBoards
          .sort((a, b) => {
            if (a.name === "자유게시판") return -1;
            if (b.name === "자유게시판") return 1;
            return 0;
          })
          .map((board) => ({
            name: board.name,
            path: boardPathMap[board.name] || `/community/${board.name}`,
          }));
      }
    }

    setMenuItems(newMenuItems);
  }, [boards]);

  return (
    <div className="navbar-wrapper">

      <div className="navbar-top">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">WithChurch</span>
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <div
                className="auth-item"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut size={26} />
                <span>로그아웃</span>
              </div>
              <div
                className="auth-item"
                onClick={() => navigate("/profile")}
              >
                <User size={26} />
                <span>프로필</span>
              </div>
            </>
          ) : (
            <>

              <div
                className="auth-item"
                onClick={() => navigate("/login")}
              >
                <LogIn size={26} />
                <span>로그인</span>
              </div>

              <div
                className="auth-item"
                onClick={() => navigate("/signup/agree")}
              >
                <UserPlus size={26} />
                <span>회원가입</span>
              </div>
            </>
          )}
        </div>
      </div>

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
