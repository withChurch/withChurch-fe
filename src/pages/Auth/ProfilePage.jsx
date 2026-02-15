import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, deleteMyAccount } from "../../api/userAPI";
import { useAuth } from "../../contexts/AuthContext";
import { User, Shield } from "lucide-react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const routes = {
    "프로필 수정": "/profile/edit",
    "비밀번호 변경": "/profile/password",
    "내 게시글": "/mypage/posts",
    "내 댓글": "/mypage/comments",
    "헌금 내역": "/mypage/offering",
    "전체 사용자 조회": "/admin/users",
  };

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const data = res.data.data;
        setUser({
          name: data.name,
          email: data.email,
          joinDate: data.registerdAt?.slice(0, 10),
          // role: data.role // 실제 API에서 role을 받아온다면 주석 해제
        });
      })
      .catch((err) => {
        console.error("❌ 프로필 조회 실패:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-view">로딩중...</div>;
  if (!user) return <div>유저 정보를 불러오지 못했습니다.</div>;

  // 관리자 여부 체크 (임시 로직: admin 이메일이거나 role 확인)
  const isAdmin = user.email === "admin@hufs.ac.kr" || user.role === "ADMIN";

  return (
    <div className="profile-page-wrapper">
      <div className="profile-content-container">
        
        <div className="white-card">
          <div className="profile-header">
            <div className="profile-image-wrapper">
              <User size={40} color="#999" />
            </div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              <div className="profile-date-badge">가입일: {user.joinDate}</div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="white-card admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
               <h3 className="section-title" style={{ marginBottom: 0 }}>관리자 메뉴</h3>
            </div>
            <SectionList 
                items={["전체 사용자 조회"]} 
                routes={routes} 
            />
          </div>
        )}

        <div className="white-card">
          <h3 className="section-title">내 정보</h3>
          <SectionList items={["프로필 수정", "비밀번호 변경"]} routes={routes} />
        </div>

        <div className="white-card">
          <h3 className="section-title">내 활동</h3>
          <SectionList
            items={["내 게시글", "내 댓글", "헌금 내역"]}
            routes={routes}
          />
        </div>

        <div className="white-card">
          <h3 className="section-title">기타</h3>
          <div className="delete-account-btn" onClick={() => setShowModal(true)}>
            회원탈퇴
          </div>
        </div>
      </div>

      {showModal && <DeleteModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// 리스트 렌더링용 컴포넌트
function SectionList({ items, routes }) {
  const navigate = useNavigate();
  return (
    <div>
      {items.map((item) => (
        <div key={item} className="list-item" onClick={() => navigate(routes[item])}>
          {item}
          <span style={{ color: "#ccc" }}>›</span>
        </div>
      ))}
    </div>
  );
}

// 모달 컴포넌트
function DeleteModal({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");

  const handleDelete = async () => {
    if (!currentPassword) return alert("비밀번호를 입력해주세요.");
    try {
      await deleteMyAccount(currentPassword);
      logout();
      alert("회원 탈퇴가 완료되었습니다.");
      onClose();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("비밀번호가 올바르지 않거나 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          정말 탈퇴하시겠습니까?
        </div>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 20, lineHeight: 1.5 }}>
          모든 계정 정보가 삭제되며<br />복구할 수 없습니다.
        </div>
        
        <input
          type="password"
          className="modal-input"
          placeholder="비밀번호 확인"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <div className="modal-btn-group">
          <button className="modal-btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn-confirm" onClick={handleDelete}>
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}