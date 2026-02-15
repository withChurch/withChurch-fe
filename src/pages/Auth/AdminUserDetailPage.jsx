import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/auth/AdminLayout";
import { User, Mail, Calendar, Shield, Phone, Lock, Hash, Activity } from "lucide-react";
import "../../components/auth/AdminForm.css";
import { getAdminUserDetail, updateAdminUser } from "../../api/adminUserAPI";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getAdminUserDetail(id);

        const u = result?.data;

        const mapped = {
          id: u?.userId ?? id,
          username: u?.loginId ?? "",
          name: u?.name ?? "",
          email: u?.email ?? "",
          phone: u?.phoneNumber ?? "",
          gender: u?.gender ?? "",
          birthDate: u?.birthAt ?? "",
          password: "",                         // 실제 비번은 안 내려오는 게 정상
          role: u?.role ?? "USER",
          status: u?.state ?? "ACTIVE",         // 화면: status
          joinDate: u?.registerdAt || u?.registeredAt || "", // 오타 대비
          updatedAt: u?.updatedAt || "",
        };

        setUser(mapped);
        setFormData(mapped);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "사용자 정보를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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

    // 서버 반영 성공 후 화면 상태 업데이트
    setUser((prev) => ({
      ...prev,
      role: formData.role,
      status: formData.status,
    }));

    setIsEditing(false);
    alert("수정되었습니다.");
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "수정 중 오류가 발생했습니다.";
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



  if (loading) return <div className="loading-text">로딩중...</div>;
  if (error) return <div className="loading-text">{error}</div>;
  if (!user) return <div className="loading-text">로딩중...</div>;

  return (
    <AdminLayout title={isEditing ? "권한/상태 수정" : "사용자 상세 정보"}>
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
          <DetailRow icon={<Lock size={18} />} label="비밀번호" value="●●●●●●" />
          <DetailRow icon={<User size={18} />} label="성별" value={user.gender === "MALE" ? "남성" : user.gender === "FEMALE" ? "여성" : "-"} />
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
    </AdminLayout>
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
