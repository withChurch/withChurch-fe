// src/pages/Auth/MyCommentsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCommentsPage.css";
import { useAuth } from "../../contexts/AuthContext";
import Pagination from "../../components/board/Pagination";

export default function MyCommentsPage() {
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

  const nameByBoardId = useMemo(() => {
    const map = {};
    BOARD_DEFS.forEach((b) => (map[b.boardId] = b.name));
    return map;
  }, [BOARD_DEFS]);

  const pathByBoardId = useMemo(() => {
    const map = {};
    BOARD_DEFS.forEach((b) => (map[b.boardId] = b.path));
    return map;
  }, [BOARD_DEFS]);

  const [allMyComments, setAllMyComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayName, setDisplayName] = useState(user?.name || user?.id || "");
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBoard]);

  const countByBoardId = useMemo(() => {
    const counts = {};
    for (const c of allMyComments) {
      if (typeof c.boardId !== "number") continue;
      counts[c.boardId] = (counts[c.boardId] || 0) + 1;
    }
    return counts;
  }, [allMyComments]);


  const visibleBoards = useMemo(() => {
    if (isAdmin) return BOARD_DEFS;

    const myBoardIds = new Set(allMyComments.map((c) => c.boardId).filter((v) => typeof v === "number"));
    return BOARD_DEFS.filter((b) => !b.adminOnly || myBoardIds.has(b.boardId));
  }, [isAdmin, BOARD_DEFS, allMyComments]);

  const filteredComments = useMemo(() => {
    if (selectedBoard === "ALL") return allMyComments;
    return allMyComments.filter((c) => c.boardId === selectedBoard);
  }, [allMyComments, selectedBoard]);

  const totalPages = useMemo(() => {
    const tp = Math.ceil(filteredComments.length / PAGE_SIZE);
    return Math.max(1, tp);
  }, [filteredComments.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const myComments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredComments.slice(start, start + PAGE_SIZE);
  }, [filteredComments, currentPage]);

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

      if (Array.isArray(d.roles) && d.roles.some((r) => String(r).toUpperCase().includes("ADMIN"))) return true;
      if (Array.isArray(d.authorities) && d.authorities.some((a) => String(a).toUpperCase().includes("ADMIN")))
        return true;

      const id = String(d.id ?? user?.id ?? "");
      const name = String(d.name ?? "");
      if (id.toLowerCase() === "admin") return true;
      if (name.includes("관리자")) return true;

      return false;
    };

    const fetchAllMyComments = async (token) => {
      const FETCH_SIZE = 200;
      const MAX_PAGES = 50;

      const seen = new Set();
      const all = [];

      for (let page = 0; page < MAX_PAGES; page++) {
        const url = new URL("https://api.withchurch.site/api/comments/me");
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

        if (!res.ok) throw new Error("내 댓글 조회 실패");

        const json = await res.json();
        const body = json?.data ?? json;

        const content = Array.isArray(body?.content) ? body.content : [];
        let newCount = 0;

        for (const item of content) {
          const id = item?.commentId ?? item?.id;
          if (id == null) continue;
          if (seen.has(id)) continue;
          seen.add(id);
          all.push(item);
          newCount++;
        }

        if (typeof body?.totalPages === "number") {
          if (page >= body.totalPages - 1) break;
        } else {
          if (content.length < FETCH_SIZE) break;
          if (newCount === 0) break;
        }
      }

      return all;
    };

    const buildPostIdToBoardIdMap = async (postIds, token) => {
      const need = new Set(postIds.filter((v) => v != null));
      const map = new Map();

      const boardIds = BOARD_DEFS.map((b) => b.boardId);
      const SIZE = 200;
      const MAX_PAGE = 50;

      for (const boardId of boardIds) {
        for (let page = 0; page < MAX_PAGE; page++) {
          if (need.size === 0) break;

          const url = new URL("https://api.withchurch.site/api/posts");
          url.searchParams.set("boardId", String(boardId));
          url.searchParams.set("page", String(page));
          url.searchParams.set("size", String(SIZE));
          url.searchParams.append("sort", "createdAt,desc");

          const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) break;

          const json = await res.json();
          const body = json?.data ?? json;
          const content = Array.isArray(body?.content) ? body.content : [];

          for (const p of content) {
            const pid = p?.postId ?? p?.id;
            if (pid == null) continue;

            if (need.has(pid)) {
              map.set(pid, boardId);
              need.delete(pid);
            }
          }

          if (typeof body?.totalPages === "number") {
            if (page >= body.totalPages - 1) break;
          } else {
            if (content.length < SIZE) break;
          }
        }
      }

      return map;
    };

    const extractBoardIdFromComment = (c) => {
      const raw =
        c?.boardId ??
        c?.postBoardId ??
        c?.board_id ??
        c?.board?.id ??
        c?.post?.boardId;

      const num = typeof raw === "string" ? Number(raw) : raw;
      return Number.isFinite(num) ? num : null;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        setSelectedBoard("ALL");
        setCurrentPage(1);
        setAllMyComments([]);

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
            setDisplayName(name || user?.name || user?.id || "");
            setIsAdmin(detectIsAdmin(userJson));
          } else {
            setDisplayName(user?.name || user?.id || "");
            setIsAdmin(false);
          }
        } catch (e) {
          setDisplayName(user?.name || user?.id || "");
          setIsAdmin(false);
        }

        const rawComments = await fetchAllMyComments(token);

        const hasBoardIdInDto = rawComments.some((c) => extractBoardIdFromComment(c) != null);
        let postIdToBoardId = new Map();

        if (!hasBoardIdInDto) {
          const postIds = Array.from(
            new Set(rawComments.map((c) => c?.postId).filter((v) => v != null))
          );
          postIdToBoardId = await buildPostIdToBoardIdMap(postIds, token);
        }

        const processed = rawComments.map((c) => {
          const createdAt = c?.createdAt || "";
          const postId = c?.postId;

          const bid = extractBoardIdFromComment(c) ?? postIdToBoardId.get(postId) ?? null;

          const category =
            typeof bid === "number"
              ? (nameByBoardId[bid] || `게시판(${bid})`)
              : "게시판";

          return {
            id: c?.commentId ?? c?.id,
            content: c?.content || "",
            createdAt,
            date: createdAt ? createdAt.split("T")[0] : "",
            postId,
            boardId: typeof bid === "number" ? bid : null,
            category,
          };
        });

        processed.sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bt - at;
        });

        setAllMyComments(processed);
      } catch (err) {
        console.error(err);
        setError("댓글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, BOARD_DEFS, nameByBoardId]);

  if (loading) return <div className="mycomments-wrapper">로딩 중...</div>;
  if (error) return <div className="mycomments-wrapper">{error}</div>;

  const selectedBoardLabel =
    selectedBoard === "ALL" ? "전체" : (nameByBoardId[selectedBoard] || `게시판(${selectedBoard})`);

  return (
    <div className="mycomments-wrapper">
      <h2 className="mycomments-title">내 댓글</h2>

      <p className="mycomments-sub">
        <span style={{ fontWeight: "bold", color: "#2c3e50" }}>{displayName}</span>님은 총{" "}
        {allMyComments.length}개의 댓글을 작성하셨습니다.
        
      </p>

      <div className="mycomments-filter">
        <button
          type="button"
          onClick={() => setSelectedBoard("ALL")}
          className={`mycomments-filter-btn ${selectedBoard === "ALL" ? "active" : ""}`}
        >
          전체 ({allMyComments.length})
        </button>

        {visibleBoards.map((b) => (
          <button
            key={b.boardId}
            type="button"
            onClick={() => setSelectedBoard(b.boardId)}
            className={`mycomments-filter-btn ${selectedBoard === b.boardId ? "active" : ""}`}
          >
            {b.name} ({countByBoardId[b.boardId] || 0})
          </button>
        ))}
      </div>

      <div className="mycomments-list">
        {myComments.length === 0 ? (
          <div className="mycomments-empty">작성한 댓글이 없습니다.</div>
        ) : (
          myComments.map((c) => (
            <div
              key={c.id}
              className="mycomments-item"
              onClick={() => {
                const basePath = c.boardId ? pathByBoardId[c.boardId] : "/community/board";
                navigate(`${basePath}/${c.postId}`);
              }}
            >
              <div className="mycomments-category">{c.category}</div>
              <div className="mycomments-content">{c.content}</div>
              <div className="mycomments-meta">{c.date} · 해당 글 바로가기 →</div>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        windowSize={5}
      />
    </div>
  );
}