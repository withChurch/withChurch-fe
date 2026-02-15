import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/auth/AdminLayout";
import { Search, User, ChevronRight, Filter } from "lucide-react";
import "../../components/auth/AdminForm.css";
import Pagination from "../../components/board/Pagination";

import { getAdminUsers } from "../../api/adminUserAPI";

export default function AdminUserListPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [users, setUsers] = useState([]);

  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const keyword = searchTerm.trim();

        const params = new URLSearchParams();
        params.append("page", String(currentPage - 1));
        params.append("size", String(pageSize));

        params.append("sort", "role,asc");
        params.append("sort", "registeredAt,desc");

        if (keyword) params.append("keyword", keyword);
        if (filterStatus !== "ALL") params.append("states", filterStatus);

        // 캐시 방지(선택)
        params.append("_ts", String(Date.now()));

        const result = await getAdminUsers(params);


        const data = result?.data ?? {};
        setUsers(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalElements(data.totalElements ?? 0);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "사용자 목록을 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, filterStatus, currentPage]);


  const displayUsers = useMemo(() => {
    const admins = users.filter((u) => u?.role === "ADMIN");
    const others = users.filter((u) => u?.role !== "ADMIN");
    return [...admins, ...others];
  }, [users]);

  return (
    <AdminLayout title="전체 사용자 조회">
      {/* 검색 및 필터 영역 */}
      <div className="admin-search-filter-container">
        <div className="search-box-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="admin-search-input"
            placeholder="이름/이메일 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box-wrapper">
          <Filter className="filter-icon" size={16} />
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">전체 보기</option>
            <option value="ACTIVE">활동 중</option>
            <option value="BANNED">정지됨</option>
          </select>
        </div>
      </div>

      {/* 사용자 리스트 */}
      <div className="white-card admin-list-card">
        <div className="list-count">총 {totalElements}명</div>

        {loading && <div className="empty-state">불러오는 중...</div>}
        {!loading && error && <div className="empty-state">{error}</div>}

        {!loading && !error && displayUsers.length > 0 ? (
          displayUsers.map((user) => {
            const id = user.userId;
            const status = user.state;
            const role = user.role;

            //  날짜만 표시
            const joinDateRaw =
              user.registeredAt || user.registerdAt || "";
            const joinDate = joinDateRaw ? joinDateRaw.slice(0, 10) : "";

            return (
              <div
                key={id}
                className="user-list-item"
                onClick={() => navigate(`/admin/users/${id}`)}
              >
                <div className="user-info-group">
                  <div
                    className={`user-avatar ${
                      role === "ADMIN" ? "admin-avatar" : ""
                    }`}
                  >
                    <User
                      size={20}
                      color={role === "ADMIN" ? "#fff" : "#999"}
                    />
                  </div>

                  <div>
                    <div className="user-name">
                      {user.name}
                      {role === "ADMIN" && (
                        <span className="badge badge-admin">관리자</span>
                      )}
                      {status === "BANNED" && (
                        <span className="badge badge-banned">정지</span>
                      )}
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
          !loading &&
          !error && <div className="empty-state">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!loading && !error && totalPages > 1 && (
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
