// src/pages/Sermon/SundaySermonListPage.jsx
import React, { useState } from "react";
import "../../components/sermons/SermonList.css";
import { useNavigate } from "react-router-dom";
import { useSermon } from "../../contexts/SermonContext";
import Pagination from "../../components/board/Pagination";
import { Search, Plus } from "lucide-react";
import SermonList from "../../components/sermons/SermonList";

export default function SundaySermonListPage() {
  const navigate = useNavigate();
  const { sermons } = useSermon();

  const [search, setSearch] = useState("");
  const filtered = sermons.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const items = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
  <SermonList
    title="주일예배"
    breadcrumbLabel="주일예배"
    breadcrumb="> 생명의말씀 > 주일예배"
    sermons={sermons}
    writePath="/sermon/sunday/write"
    detailPath="/sermon/sunday"
  />

  );
}
