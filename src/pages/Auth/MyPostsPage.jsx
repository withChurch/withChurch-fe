// src/pages/Auth/MyPostsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPostsPage.css";
import { useAuth } from "../../contexts/AuthContext";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [displayName, setDisplayName] = useState(user?.name || user?.id);

  const categoryMap = {
    1: "자유게시판",
    2: "공지사항",
    3: "중보기도",
    4: "교회소식", 
  };

  const linkMap = {
    "자유게시판": "/community/board",
    "공지사항": "/news/notices",
    "중보기도": "/community/prayer",
    "교회소식": "/news/updates",
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken"); 


        let realName = user.id;

        try {
          const userRes = await fetch("https://api.withchurch.site/api/users/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, 
            },
          });

          if (userRes.ok) {
            const userJson = await userRes.json();
            if (userJson.data && userJson.data.name) {
               realName = userJson.data.name; 
               console.log("내 한글 이름 확인:", realName);
               setDisplayName(realName);
            }
          } else {
            console.warn("내 정보 조회 실패 (토큰 문제일 수 있음)");
          }
        } catch (e) {
          console.error("이름 조회 중 에러:", e);
        }

        const boardIds = [1, 2, 3, 4];
        const requests = boardIds.map(id => 
            fetch(`https://api.withchurch.site/api/posts?boardId=${id}&page=0&size=50`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            }).then(res => res.json())
        );

        const results = await Promise.all(requests);
        const allPosts = results.flatMap(result => result.data?.content || []);


        const myFilteredPosts = allPosts.filter(post => {
            return post.UserName === user.id || post.UserName === realName;
        });

        // 가공
        const processedPosts = myFilteredPosts.map((p) => ({
          id: p.postId,
          title: p.title,
          category: categoryMap[p.boardId] || "기타",
          date: p.createdAt ? p.createdAt.split("T")[0] : "",
          views: p.viewCount,
          author: p.UserName
        }));

        // 최신순 정렬
        processedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyPosts(processedPosts);

      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="myposts-wrapper">로딩 중...</div>;
  if (error) return <div className="myposts-wrapper">{error}</div>;

  return (
    <div className="myposts-wrapper">
      <h2 className="myposts-title">내 게시글</h2>
      <p className="myposts-sub">
        <span style={{fontWeight:"bold", color:"#2c3e50"}}>{displayName}</span>님은 총 {myPosts.length}개의 게시글을 작성하셨습니다.
      </p>

      <div className="myposts-list">
        {myPosts.length === 0 ? (
          <div className="myposts-empty">
            작성한 글이 없습니다.
          </div>
        ) : (
          myPosts.map((post) => (
            <div
              key={post.id}
              className="myposts-item"
              onClick={() =>
                navigate(`${linkMap[post.category] || "/community/board"}/${post.id}`)
              }
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
    </div>
  );
}