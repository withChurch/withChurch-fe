import React from "react";
import { User, Pencil } from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "박시현",
    ministry: "한국외대",
    email: "tlgus0929@gmail.com",
    joinDate: "2025-11-21",
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "190px auto",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          paddingBottom: 32,
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={60} color="#777" />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 6,
            }}
          >
            {user.name}
          </div>

          <div
            style={{
              fontSize: 16,
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
            <span style={{ fontSize: 16 }}>{user.email}</span>
            <Pencil size={17} style={{ cursor: "pointer" }} />
          </div>

          <div style={{ fontSize: 14, color: "#777" }}>
            가입일: {user.joinDate}
          </div>
        </div>
      </div>

      <SectionBlock title="내 정보" items={["프로필 수정", "비밀번호 변경"]} />

      <SectionBlock
        title="내 활동"
        items={["내 게시글","내 댓글", "헌금 내역"]}
      />
    </div>
  );
}

function SectionBlock({ title, items }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 16,
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
              padding: "14px 20px",
              borderBottom:
                index !== items.length - 1 ? "1px solid #eee" : "none",
              fontSize: 16,
              cursor: "pointer",
              background: "white",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

