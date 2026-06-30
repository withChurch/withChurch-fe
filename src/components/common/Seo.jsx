import { useEffect, useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";

const SITE_NAME = "WithChurch";
const DEFAULT_DESCRIPTION =
  "교회 소개, 예배 안내, 설교, 공지사항과 교회 소식을 확인하세요.";

const exactMeta = {
  "/": {
    title: "WithChurch",
    description:
      "WithChurch는 교회 소개, 예배 안내, 설교, 공지사항과 교회 소식을 제공하는 교회 홈페이지입니다.",
  },
  "/about/greeting": {
    title: "인사말 | WithChurch",
    description: "교회 인사말과 사역 방향을 소개합니다.",
  },
  "/about/worship-info": {
    title: "예배 안내 | WithChurch",
    description: "주일예배와 교회 예배 시간을 안내합니다.",
  },
  "/about/pastor": {
    title: "담임목사 소개 | WithChurch",
    description: "담임목사 소개와 목회 철학을 확인하세요.",
  },
  "/about/offering": {
    title: "온라인 헌금 | WithChurch",
    description: "온라인 헌금 안내를 확인하세요.",
  },
  "/about/location": {
    title: "오시는 길 | WithChurch",
    description: "교회 위치와 교통 안내를 확인하세요.",
  },
  "/news/notices": {
    title: "공지사항 | WithChurch",
    description: "교회 공지사항을 확인하세요.",
  },
  "/news/updates": {
    title: "교회소식 | WithChurch",
    description: "교회 소식과 최근 업데이트를 확인하세요.",
  },
  "/sermon/sunday": {
    title: "주일예배 설교 | WithChurch",
    description: "주일예배 설교 말씀을 확인하세요.",
  },
  "/sermon/dawn": {
    title: "새벽예배 설교 | WithChurch",
    description: "새벽예배 설교 말씀을 확인하세요.",
  },
  "/community/board": {
    title: "자유게시판 | WithChurch",
    description: "교회 자유게시판 글을 확인하세요.",
  },
  "/community/prayer": {
    title: "중보기도 | WithChurch",
    description: "중보기도 게시판 글을 확인하세요.",
  },
};

const patternMeta = [
  ["/news/notices/:id", "공지사항 | WithChurch", "교회 공지사항 상세 글입니다."],
  ["/news/updates/:id", "교회소식 | WithChurch", "교회소식 상세 글입니다."],
  ["/sermon/sunday/:id", "주일예배 설교 | WithChurch", "주일예배 설교 상세 페이지입니다."],
  ["/sermon/dawn/:id", "새벽예배 설교 | WithChurch", "새벽예배 설교 상세 페이지입니다."],
  ["/community/board/:id", "자유게시판 | WithChurch", "자유게시판 상세 글입니다."],
  ["/community/prayer/:id", "중보기도 | WithChurch", "중보기도 상세 글입니다."],
];

const noindexPatterns = [
  "/login",
  "/signup",
  "/signup/*",
  "/find-id",
  "/find-id/*",
  "/find-password",
  "/find-password/*",
  "/verify-code",
  "/profile",
  "/profile/*",
  "/mypage/*",
  "/admin/*",
  "/community/board/write",
  "/community/board/edit/:id",
  "/community/prayer/write",
  "/community/prayer/edit/:id",
  "/news/notices/write",
  "/news/notices/edit/:id",
  "/news/updates/write",
  "/news/updates/edit/:id",
  "/sermon/sunday/write",
  "/sermon/sunday/edit/:id",
  "/sermon/dawn/write",
  "/sermon/dawn/edit/:id",
];

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function normalizePath(pathname) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

function findRouteMeta(pathname) {
  if (exactMeta[pathname]) {
    return exactMeta[pathname];
  }

  const matched = patternMeta.find(([pattern]) =>
    matchPath({ path: pattern, end: true }, pathname)
  );

  if (matched) {
    return {
      title: matched[1],
      description: matched[2],
    };
  }

  return {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  };
}

function getSiteUrl() {
  if (typeof window === "undefined") {
    return "https://withchurch.site";
  }

  return window.location.origin;
}

export default function Seo() {
  const location = useLocation();

  const seo = useMemo(() => {
    const pathname = normalizePath(location.pathname);
    const canonical = `${getSiteUrl()}${pathname}`;
    const meta = findRouteMeta(pathname);
    const shouldNoindex = noindexPatterns.some((pattern) =>
      matchPath({ path: pattern, end: true }, pathname)
    );

    return {
      ...meta,
      canonical,
      robots: shouldNoindex ? "noindex, nofollow" : "index, follow",
    };
  }, [location.pathname]);

  useEffect(() => {
    document.title = seo.title;
    upsertCanonical(seo.canonical);
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: seo.description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: seo.robots,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: seo.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: seo.description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: seo.canonical,
    });
  }, [seo]);

  return null;
}
