import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { User, Pencil } from "lucide-react";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const user = {
    name: "박시현",
    ministry: "한국외대",
    email: "tlgus0929@gmail.com",
    joinDate: "2025-11-21",
  };
  const routes = {
  "프로필 수정": "/profile/edit",
  "비밀번호 변경": "/profile/password",
  "내 게시글": "/mypage/posts",
  "내 댓글": "/mypage/comments",
  "헌금 내역": "/mypage/offering",
};

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "167px auto",
        padding: "0 170px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 35,
          paddingBottom: 30,
          borderBottom: "1px solid #e4e4e4ff",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={59} color="#777" />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 27,
              fontWeight: "500",
              textShadow: "0.05px 0 0 currentColor",
              letterSpacing: "-0.1px",

              marginBottom: 6,
            }}
          >
            {user.name}
          </div>

          <div
            style={{
              fontSize: 15.5,
              color: "#555",
              marginBottom: 4,
            }}
          >
            {user.ministry}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 15.5 , opacity: 0.9}}>{user.email}</span>
            <Pencil size={16} style={{ cursor: "pointer" }} />
          </div>

          <div style={{ fontSize: 13.6, color: "#777" }}>
            가입일: {user.joinDate}
          </div>
        </div>
      </div>

      <SectionBlock title="내 정보" items={["프로필 수정", "비밀번호 변경"]} routes={routes} />

      <SectionBlock
        title="내 활동" items={["내 게시글","내 댓글", "헌금 내역"]} routes={routes}
      />

      <div style={{ marginTop: 40 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: "500",
            marginBottom: 16,
          }}
        >
          기타
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              fontSize: 16,
              cursor: "pointer",
              background: "white",
              color: "#d9534f",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            onClick={() => setShowModal(true)}
          >
            회원탈퇴
          </div>
        </div>
      </div>

      {showModal && <DeleteModal onClose={() => setShowModal(false)} />}


    </div>
  );
}

function SectionBlock({ title, items, routes }) {
    const navigate = useNavigate(); 
  return (
    <div style={{ marginTop: 37 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: "500",
          marginBottom: 15,
        }}
      >
        {title}
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            style={{
              padding: "13px 20px",
              borderBottom:
                index !== items.length - 1 ? "1px solid #eee" : "none",
              fontSize: 15,
              cursor: "pointer",
              background: "white",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}

            onClick={() => navigate(routes[item])}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteModal({ onClose }) {
    const navigate = useNavigate();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 360,
          background: "white",
          borderRadius: 8,
          padding: "24px 28px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
          정말 탈퇴하시겠습니까?
        </div>

        <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
          모든 계정 정보가 삭제되며 복구할 수 없습니다.
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            취소
          </button>

          <button
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              background: "#d9534f",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              alert("탈퇴가 완료되었습니다. (여기서 API 연동하기)");
              onClose();
              navigate("/");
            }}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}