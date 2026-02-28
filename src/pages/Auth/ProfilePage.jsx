import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, deleteMyAccount } from "../../api/userAPI";
import { useAuth } from "../../contexts/AuthContext";
import { User, Shield } from "lucide-react";
import ProfilePageSkeleton from "../../components/skeleton/ProfilePageSkeleton";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorType, setErrorType] = useState(null);

  const routes = {
    "프로필 수정": "/profile/edit",
    "비밀번호 변경": "/profile/password",
    "내 게시글": "/mypage/posts",
    "내 댓글": "/mypage/comments",
    "헌금 내역": "/mypage/offering",
    "전체 사용자 조회": "/admin/users",
  };

  const fetchProfile = useCallback(() => {
    setLoading(true);
    setErrorType(null);

    return getMyProfile()
      .then((res) => {
        const data = res.data.data;
        setUser({
          name: data.name,
          email: data.email,
          joinDate: data.registeredAt?.slice(0, 10),
          role: data.role,
        });
      })
      .catch((err) => {
        console.error("❌ 프로필 조회 실패:", err);

        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || "";

        const isAuthError =
          status === 401 ||
          status === 403 ||
          /token|jwt|expire|expired|만료/i.test(msg);

        setUser(null);

        if (isAuthError) {

          try {
            logout();
          } catch (e) {}

          setErrorType("AUTH");
        } else {
          setErrorType("GENERAL");
        }
      })
      .finally(() => setLoading(false));
  }, [logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <ProfilePageSkeleton />;

  if (errorType === "AUTH") {
    return (
      <StatusView
        icon={<Shield size={34} color="#999" />}
        title="로그아웃되었습니다"
        desc={"세션이 만료되어 내 정보를 불러올 수 없어요.\n다시 로그인해 주세요."}
        primaryText="다시 로그인"
        onPrimary={() => navigate("/login")}
        secondaryText="홈으로"
        onSecondary={() => navigate("/")}
      />
    );
  }

  if (errorType === "GENERAL") {
    return (
      <StatusView
        icon={<User size={34} color="#999" />}
        title="유저 정보를 불러오지 못했습니다"
        desc={"네트워크 상태를 확인하거나\n잠시 후 다시 시도해 주세요."}
        primaryText="다시 시도"
        onPrimary={fetchProfile}
        secondaryText="홈으로"
        onSecondary={() => navigate("/")}
      />
    );
  }

  // 여기부터는 user가 있다고 가정
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <h3 className="section-title" style={{ marginBottom: 0 }}>
                관리자 메뉴
              </h3>
            </div>
            <SectionList items={["전체 사용자 조회"]} routes={routes} />
          </div>
        )}

        <div className="white-card">
          <h3 className="section-title">내 정보</h3>
          <SectionList items={["프로필 수정", "비밀번호 변경"]} routes={routes} />
        </div>

        <div className="white-card">
          <h3 className="section-title">내 활동</h3>
          <SectionList items={["내 게시글", "내 댓글"]} routes={routes} />
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

function StatusView({
  icon,
  title,
  desc,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
}) {
  return (
    <div className="profile-page-wrapper">
      <div className="profile-content-container">
        <div className="white-card status-card">
          <div className="status-icon">{icon}</div>
          <div className="status-title">{title}</div>
          <div className="status-desc">{desc}</div>

          <div className="status-btn-group">
            {secondaryText && (
              <button className="status-btn secondary" onClick={onSecondary}>
                {secondaryText}
              </button>
            )}
            {primaryText && (
              <button className="status-btn primary" onClick={onPrimary}>
                {primaryText}
              </button>
            )}
          </div>
        </div>
      </div>
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