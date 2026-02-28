import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/auth/AdminLayout";
import { Search, User, ChevronRight, Filter, Shield, AlertCircle } from "lucide-react";
import "../../components/auth/AdminForm.css";
import Pagination from "../../components/board/Pagination";
import { getAdminUsers } from "../../api/adminUserAPI";
import { useAuth } from "../../contexts/AuthContext";
import AdminUserListSkeleton from "../../components/skeleton/AdminUserListSkeleton";

export default function AdminUserListPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [users, setUsers] = useState([]);

  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  const [errorType, setErrorType] = useState(null); // null | "AUTH" | "GENERAL"
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorType(null);
    setErrorMessage("");

    try {
      const keyword = searchTerm.trim();

      const params = new URLSearchParams();
      params.append("page", String(currentPage - 1));
      params.append("size", String(pageSize));

      params.append("sort", "role,asc");
      params.append("sort", "registeredAt,desc");

      if (keyword) params.append("keyword", keyword);
      if (filterStatus !== "ALL") params.append("states", filterStatus);

      params.append("_ts", String(Date.now()));

      const result = await getAdminUsers(params);

      const data = result?.data ?? {};
      setUsers(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalElements(data.totalElements ?? 0);
    } catch (e) {
      console.error(e);

      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "사용자 목록을 불러오지 못했습니다.";

      const isAuthError = status === 401 || status === 403;

      if (isAuthError) {
        try { logout(); } catch (_) {}

        setErrorType("AUTH");
        setErrorMessage("세션이 만료되어 사용자 목록을 불러올 수 없습니다.\n다시 로그인해 주세요.");
      } else {
        setErrorType("GENERAL");
        setErrorMessage(msg);
      }

      setUsers([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, currentPage, pageSize, logout]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const displayUsers = useMemo(() => {
    const admins = users.filter((u) => u?.role === "ADMIN");
    const others = users.filter((u) => u?.role !== "ADMIN");
    return [...admins, ...others];
  }, [users]);

  return (
    <AdminLayout title="전체 사용자 조회" backTo="/profile">
      {/* 검색 및 필터 영역 */}
      <div className="admin-search-filter-container">
        <div className="search-box-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="admin-search-input"
            placeholder="이름/이메일 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-box-wrapper">
          <Filter className="filter-icon" size={16} />
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">전체 보기</option>
            <option value="ACTIVE">활동 중</option>
            <option value="BANNED">정지됨</option>
          </select>
        </div>
      </div>

      {/* 사용자 리스트 */}
      <div className="white-card admin-list-card" aria-busy={loading ? "true" : "false"}>
        <div className="list-count">
          {loading ? <span className="skeleton skel-count" /> : `총 ${totalElements}명`}
        </div>

        {loading && <AdminUserListSkeleton rows={10} />}

        {!loading && errorType === "AUTH" && (
          <AdminStatusView
            icon={<Shield size={32} color="#999" />}
            title="로그아웃되었습니다"
            desc={errorMessage}
            primaryText="다시 로그인"
            onPrimary={() => navigate("/login")}
            secondaryText="홈으로"
            onSecondary={() => navigate("/")}
          />
        )}

        {!loading && errorType === "GENERAL" && (
          <AdminStatusView
            icon={<AlertCircle size={32} color="#999" />}
            title="사용자 목록을 불러오지 못했습니다"
            desc={errorMessage}
            primaryText="다시 시도"
            onPrimary={fetchUsers}
            secondaryText="뒤로"
            onSecondary={() => navigate(-1)}
          />
        )}

        {!loading && !errorType && displayUsers.length > 0 ? (
          displayUsers.map((user) => {
            const id = user.userId;
            const status = user.state;
            const role = user.role;

            const joinDateRaw = user.registeredAt || user.registerdAt || "";
            const joinDate = joinDateRaw ? joinDateRaw.slice(0, 10) : "";

            return (
              <div
                key={id}
                className="user-list-item"
                onClick={() => navigate(`/admin/users/${id}`)}
              >
                <div className="user-info-group">
                  <div className={`user-avatar ${role === "ADMIN" ? "admin-avatar" : ""}`}>
                    <User size={20} color={role === "ADMIN" ? "#fff" : "#999"} />
                  </div>

                  <div>
                    <div className="user-name">
                      {user.name}
                      {role === "ADMIN" && <span className="badge badge-admin">관리자</span>}
                      {status === "BANNED" && <span className="badge badge-banned">정지</span>}
                    </div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>

                <div className="user-meta-group">
                  <span className="join-date">{joinDate}</span>
                  <ChevronRight size={18} color="#ccc" />
                </div>
              </div>
            );
          })
        ) : (
          !loading && !errorType && <div className="empty-state">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!loading && !errorType && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          windowSize={5}
        />
      )}
    </AdminLayout>
  );
}

function AdminStatusView({
  icon,
  title,
  desc,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
}) {
  return (
    <div className="admin-status-wrap">
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