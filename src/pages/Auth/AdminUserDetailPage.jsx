import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/auth/AdminLayout";
import { User, Mail, Calendar, Shield, Phone, Hash, Activity, AlertCircle } from "lucide-react";
import "../../components/auth/AdminForm.css";
import { getAdminUserDetail, updateAdminUser } from "../../api/adminUserAPI";
import { useAuth } from "../../contexts/AuthContext";
import AdminUserDetailSkeleton from "../../components/skeleton/AdminUserDetailSkeleton";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});

  // ✅ 처음부터 true
  const [loading, setLoading] = useState(true);

  // ✅ 에러 타입 분리
  const [errorType, setErrorType] = useState(null); // null | "AUTH" | "GENERAL"
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setErrorType(null);
    setErrorMessage("");

    try {
      const result = await getAdminUserDetail(id);
      const u = result?.data;

      const joinDateRaw = u?.registerdAt || u?.registeredAt || "";
      const mapped = {
        id: u?.userId ?? id,
        username: u?.loginId ?? "",
        name: u?.name ?? "",
        email: u?.email ?? "",
        phone: u?.phoneNumber ?? "",
        gender: u?.gender ?? "",
        birthDate: u?.birthAt ?? "",
        password: "",
        role: u?.role ?? "USER",
        status: u?.state ?? "ACTIVE",
        joinDate: joinDateRaw ? joinDateRaw.slice(0, 10) : "",
        updatedAt: u?.updatedAt || "",
      };

      setUser(mapped);
      setFormData(mapped);
    } catch (e) {
      console.error(e);

      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "사용자 정보를 불러오지 못했습니다.";

      if (status === 401 || status === 403) {
        setErrorType("AUTH");
        setErrorMessage("세션이 만료되어 사용자 정보를 불러올 수 없습니다.\n다시 로그인해 주세요.");
        // ⚠️ 여기서 logout()이 자동으로 페이지 이동을 해버리면
        // 아래 안내 화면이 안 보일 수 있어서 버튼에서 처리하는 걸 추천
      } else {
        setErrorType("GENERAL");
        setErrorMessage(msg);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!window.confirm("권한 및 상태 정보를 수정하시겠습니까?")) return;

    try {
      await updateAdminUser(id, formData.role, formData.status);

      setUser((prev) => ({
        ...prev,
        role: formData.role,
        status: formData.status,
      }));

      setIsEditing(false);
      alert("수정되었습니다.");
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "수정 중 오류가 발생했습니다.";

      // 세션 만료면 안내 + 로그인 유도(원하면 이렇게)
      if (status === 401 || status === 403) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        try { logout(); } catch (_) {}
        navigate("/login"); // TODO: 로그인 라우트로 수정
        return;
      }

      alert(msg);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
  };

  const handleGoList = () => {
    navigate("/admin/users");
  };

  const handleRelogin = () => {
    try { logout(); } catch (_) {}
    navigate("/login"); // TODO: 로그인 라우트로 수정
  };

  return (
    <AdminLayout title={isEditing ? "권한/상태 수정" : "사용자 상세 정보"}>
      {/* ✅ 로딩: 스켈레톤 */}
      {loading && <AdminUserDetailSkeleton />}

      {/* ✅ 세션 만료 */}
      {!loading && errorType === "AUTH" && (
        <div className="white-card detail-card">
          <AdminStatusView
            icon={<Shield size={32} color="#999" />}
            title="로그아웃되었습니다"
            desc={errorMessage}
            primaryText="다시 로그인"
            onPrimary={handleRelogin}
            secondaryText="목록으로"
            onSecondary={handleGoList}
          />
        </div>
      )}

      {/* ✅ 일반 오류 */}
      {!loading && errorType === "GENERAL" && (
        <div className="white-card detail-card">
          <AdminStatusView
            icon={<AlertCircle size={32} color="#999" />}
            title="사용자 정보를 불러오지 못했습니다"
            desc={errorMessage}
            primaryText="다시 시도"
            onPrimary={fetchUser}
            secondaryText="목록으로"
            onSecondary={handleGoList}
          />
        </div>
      )}

      {/* ✅ 정상 */}
      {!loading && !errorType && user && (
        <div className="white-card detail-card">
          <div className="detail-header">
            <div className="detail-avatar">
              <User size={40} color="#8c6b5d" />
            </div>
            <h2 className="detail-name">{user.name}</h2>

            {!isEditing && (
              <span className={`detail-role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}>
                {user.role === "ADMIN" ? "관리자" : "일반 사용자"}
              </span>
            )}
          </div>

          <hr className="divider" />

          <div className="detail-info-list">
            <SectionLabel>개인 정보 (수정 불가)</SectionLabel>

            <DetailRow icon={<Hash size={18} />} label="아이디" value={user.username} />
            <DetailRow
              icon={<User size={18} />}
              label="성별"
              value={
                user.gender === "MALE" ? "남성" : user.gender === "FEMALE" ? "여성" : "-"
              }
            />
            <DetailRow icon={<Calendar size={18} />} label="생년월일" value={user.birthDate || "-"} />
            <DetailRow icon={<Mail size={18} />} label="이메일" value={user.email || "-"} />
            <DetailRow icon={<Phone size={18} />} label="전화번호" value={user.phone || "-"} />

            <div style={{ marginTop: 30 }} />

            <SectionLabel>관리 정보 (수정 가능)</SectionLabel>

            <DetailRow
              icon={<Shield size={18} />}
              label="권한"
              name="role"
              value={formData.role}
              isEditing={isEditing}
              editable={true}
              onChange={handleChange}
              type="select"
              options={[
                { value: "USER", label: "일반 사용자" },
                { value: "ADMIN", label: "관리자" },
              ]}
            />

            <DetailRow
              icon={<Activity size={18} />}
              label="계정 상태"
              name="status"
              value={formData.status}
              isEditing={isEditing}
              editable={true}
              onChange={handleChange}
              type="select"
              options={[
                { value: "ACTIVE", label: "활동 중" },
                { value: "BANNED", label: "활동중지" },
              ]}
              highlight={formData.status === "ACTIVE" ? "green" : "red"}
            />

            <DetailRow icon={<Calendar size={18} />} label="가입일" value={user.joinDate || "-"} />
          </div>

          <div className="detail-actions">
            <button className="btn-action btn-secondary btn-list" onClick={handleGoList}>
              목록으로
            </button>

            <div className="detail-actions-right">
              {isEditing ? (
                <>
                  <button className="btn-action btn-secondary" onClick={handleCancel}>
                    취소
                  </button>
                  <button className="btn-action btn-primary" onClick={handleSave}>
                    저장하기
                  </button>
                </>
              ) : (
                <button className="btn-action btn-primary" onClick={handleEditClick}>
                  권한/상태 관리
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ✅ 상태 안내(리스트 페이지랑 같은 스타일 재사용)
function AdminStatusView({ icon, title, desc, primaryText, onPrimary, secondaryText, onSecondary }) {
  return (
    <div>
      <div className="admin-status-icon">{icon}</div>
      <div className="admin-status-title">{title}</div>
      <div className="admin-status-desc">{desc}</div>

      <div className="admin-status-btn-group">
        {secondaryText && (
          <button className="admin-status-btn secondary" onClick={onSecondary}>
            {secondaryText}
          </button>
        )}
        {primaryText && (
          <button className="admin-status-btn primary" onClick={onPrimary}>
            {primaryText}
          </button>
        )}
      </div>
    </div>
  );
}

// 소제목
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 13, color: "#aaa", fontWeight: 600, marginBottom: 10, paddingLeft: 4 }}>
    {children}
  </div>
);

function DetailRow({ icon, label, value, name, isEditing, editable, onChange, type, options, highlight }) {
  if (isEditing && editable) {
    return (
      <div className="detail-row editing">
        <div className="detail-label-group">
          <span className="detail-icon">{icon}</span>
          <span className="detail-label">{label}</span>
        </div>
        <div className="detail-input-wrapper">
          {type === "select" && (
            <select name={name} value={value} onChange={onChange} className="edit-select">
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  }

  let displayValue = value;
  if (type === "select" && options) {
    const found = options.find((opt) => opt.value === value);
    if (found) displayValue = found.label;
  }

  return (
    <div className="detail-row">
      <div className="detail-label-group">
        <span className="detail-icon">{icon}</span>
        <span className="detail-label">{label}</span>
      </div>
      <div className={`detail-value ${highlight ? `text-${highlight}` : ""}`}>{displayValue}</div>
    </div>
  );
}