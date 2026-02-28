// src/pages/Auth/MyPostsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPostsPage.css";
import { useAuth } from "../../contexts/AuthContext";
import Pagination from "../../components/board/Pagination";
import MyPostsPageSkeleton from "../../components/skeleton/MyPostsPageSkeleton";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const PAGE_SIZE = 15;

  const BOARD_DEFS = useMemo(
    () => [
      { boardId: 1, name: "자유게시판", path: "/community/board", adminOnly: false },
      { boardId: 3, name: "중보기도", path: "/community/prayer", adminOnly: false },
      { boardId: 4, name: "교회소식", path: "/news/updates", adminOnly: true },
      { boardId: 2, name: "공지사항", path: "/news/notices", adminOnly: true },
      { boardId: 5, name: "주일예배", path: "/sermon/sunday", adminOnly: true },
      { boardId: 6, name: "새벽예배", path: "/sermon/dawn", adminOnly: true },
    ],
    []
  );

  const categoryMap = useMemo(() => {
    const map = {};
    BOARD_DEFS.forEach((b) => (map[b.boardId] = b.name));
    return map;
  }, [BOARD_DEFS]);

  const linkMapByBoardId = useMemo(() => {
    const map = {};
    BOARD_DEFS.forEach((b) => (map[b.boardId] = b.path));
    return map;
  }, [BOARD_DEFS]);

  const [allMyPosts, setAllMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayName, setDisplayName] = useState(user?.name || user?.id || "");
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const countByBoardId = useMemo(() => {
    const counts = {};
    for (const p of allMyPosts) {
      const bid = p.boardId;
      if (typeof bid !== "number") continue;
      counts[bid] = (counts[bid] || 0) + 1;
    }
    return counts;
  }, [allMyPosts]);

  const visibleBoards = useMemo(() => {
    if (isAdmin) return BOARD_DEFS;

    const myBoardIds = new Set(allMyPosts.map((p) => p.boardId));
    return BOARD_DEFS.filter((b) => !b.adminOnly || myBoardIds.has(b.boardId));
  }, [isAdmin, BOARD_DEFS, allMyPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedBoard === "ALL") return allMyPosts;
    return allMyPosts.filter((p) => p.boardId === selectedBoard);
  }, [allMyPosts, selectedBoard]);

  const totalPages = useMemo(() => {
    const tp = Math.ceil(filteredPosts.length / PAGE_SIZE);
    return Math.max(1, tp);
  }, [filteredPosts.length]);

  const myPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBoard]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!user) return;

    const detectIsAdmin = (userJson) => {
      const d = userJson?.data ?? userJson;
      if (!d) return false;

      const roleCandidates = [d.role, d.userRole, d.authority, d.userType, d.type].filter(Boolean);

      for (const r of roleCandidates) {
        if (typeof r === "string" && r.toUpperCase().includes("ADMIN")) return true;
      }

      if (d.isAdmin === true) return true;

      if (Array.isArray(d.roles) && d.roles.some((r) => String(r).toUpperCase().includes("ADMIN")))
        return true;

      if (
        Array.isArray(d.authorities) &&
        d.authorities.some((a) => String(a).toUpperCase().includes("ADMIN"))
      )
        return true;

      const id = String(d.id ?? user?.id ?? "");
      const name = String(d.name ?? "");
      if (id.toLowerCase() === "admin") return true;
      if (name.includes("관리자")) return true;

      return false;
    };

    const fetchAllMyPosts = async (token) => {
      const FETCH_SIZE = 200;
      const MAX_PAGES = 50;

      const seen = new Set();
      const all = [];

      for (let page = 0; page < MAX_PAGES; page++) {
        const url = new URL("https://api.withchurch.site/api/posts/me");
        url.searchParams.set("page", String(page));
        url.searchParams.set("size", String(FETCH_SIZE));
        url.searchParams.append("sort", "createdAt,desc");

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("내 게시글 조회 실패");

        const json = await res.json();
        const body = json?.data ?? json;

        let content = [];
        if (Array.isArray(body)) content = body;
        else if (Array.isArray(body?.content)) content = body.content;
        else if (Array.isArray(json?.content)) content = json.content;

        let newCount = 0;
        for (const item of content) {
          const id = item?.postId ?? item?.id;
          if (id == null) continue;
          if (seen.has(id)) continue;
          seen.add(id);
          all.push(item);
          newCount++;
        }

        if (typeof body?.totalPages === "number") {
          if (page >= body.totalPages - 1) break;
          continue;
        }

        if (content.length < FETCH_SIZE) break;
        if (newCount === 0) break;
      }

      return all;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        setSelectedBoard("ALL");
        setCurrentPage(1);
        setAllMyPosts([]);

        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("토큰 없음");

        try {
          const userRes = await fetch("https://api.withchurch.site/api/users/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (userRes.ok) {
            const userJson = await userRes.json();
            const name = userJson?.data?.name;

            if (name) setDisplayName(name);
            else setDisplayName(user?.name || user?.id || "");

            setIsAdmin(detectIsAdmin(userJson));
          } else {
            setDisplayName(user?.name || user?.id || "");
            setIsAdmin(false);
          }
        } catch (e) {
          setDisplayName(user?.name || user?.id || "");
          setIsAdmin(false);
        }

        const rawPosts = await fetchAllMyPosts(token);

        const processed = rawPosts.map((p) => {
          const boardId = typeof p.boardId === "number" ? p.boardId : Number(p.boardId);
          const createdAt = p.createdAt || "";
          const category =
            categoryMap[boardId] ||
            p.boardName ||
            (Number.isFinite(boardId) ? `게시판(${boardId})` : "게시판");

          return {
            id: p.postId ?? p.id,
            title: p.title,
            boardId,
            category,
            createdAt,
            date: createdAt ? createdAt.split("T")[0] : "",
            views: p.viewCount ?? 0,
            author: p.UserName ?? p.userName ?? "",
          };
        });

        processed.sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bt - at;
        });

        setAllMyPosts(processed);
      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, categoryMap]);

  // ✅ 로딩 시: 스켈레톤 UI
  if (loading) return <MyPostsPageSkeleton cards={6} filters={6} />;
  if (error) return <div className="myposts-wrapper">{error}</div>;

  const selectedBoardLabel =
    selectedBoard === "ALL" ? "전체" : categoryMap[selectedBoard] || `게시판(${selectedBoard})`;

  return (
    <div className="myposts-wrapper">
      <h2 className="myposts-title">내 게시글</h2>

      <p className="myposts-sub">
        <span style={{ fontWeight: "bold", color: "#2c3e50" }}>{displayName}</span>
        님은 총 {allMyPosts.length}개의 게시글을 작성하셨습니다.
      </p>

      <div className="myposts-filter" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setSelectedBoard("ALL")}
          className={`myposts-filter-btn ${selectedBoard === "ALL" ? "active" : ""}`}
        >
          전체 ({allMyPosts.length})
        </button>

        {visibleBoards.map((b) => (
          <button
            key={b.boardId}
            type="button"
            onClick={() => setSelectedBoard(b.boardId)}
            className={`myposts-filter-btn ${selectedBoard === b.boardId ? "active" : ""}`}
          >
            {b.name} ({countByBoardId[b.boardId] || 0})
          </button>
        ))}
      </div>

      <div className="myposts-list">
        {myPosts.length === 0 ? (
          <div className="myposts-empty">작성한 글이 없습니다.</div>
        ) : (
          myPosts.map((post) => (
            <div
              key={post.id}
              className="myposts-item"
              onClick={() => {
                const basePath = linkMapByBoardId[post.boardId] || "/community/board";
                navigate(`${basePath}/${post.id}`);
              }}
            >
              <div className="myposts-category">{post.category}</div>
              <div className="myposts-title-row">
                <span className="myposts-post-title">{post.title}</span>
              </div>
              <div className="myposts-bottom">
                <span className="myposts-date">{post.date}</span>
                <span className="myposts-views">조회수 {post.views}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} windowSize={5} />
    </div>
  );
}