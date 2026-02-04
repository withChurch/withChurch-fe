// src/pages/Sermon/SundaySermonEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../../components/board/PostForm";
import { useBoard } from "../../contexts/BoardContext";
import * as boardAPI from "../../api/boardAPI";

export default function SundaySermonEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost } = useBoard();
  
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await boardAPI.getPost(id);
        const data = response.data.data;
        
        setInitialData({
          title: data.title,
          content: data.content,
          files: data.files || [],

        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("게시글 정보를 가져오지 못했습니다.");
        navigate("/sermon/sunday");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await updatePost(id, { ...formData, category: "주일예배" });
      navigate(`/sermon/sunday/${id}`);
    } catch (error) {
      console.error(error);
      alert("수정에 실패했습니다.");
    }
  };
  if (!initialData) return <div>로딩 중...</div>;

  return (
    <PostForm
      breadcrumb="◦ 생명의 말씀 > 주일예배 > 글수정"
      pageTitle="주일예배 수정"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/sermon/sunday/${id}`)}
    />
  );
}