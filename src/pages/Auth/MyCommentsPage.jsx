// src/pages/Auth/MyCommentsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCommentsPage.css";
import { useAuth } from "../../contexts/AuthContext";

export default function MyCommentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(user?.name || user?.id); // 이름 표시용

  const boardIdToName = {
    1: "자유게시판",
    2: "공지사항",
    3: "중보기도",
    4: "교회소식", 
  };

  const categoryMap = {
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
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userJson = await userRes.json();
            if (userJson.data && userJson.data.name) {
               realName = userJson.data.name; 
               setDisplayName(realName); 
            }
          }
        } catch (e) { console.error(e); }


        const boardIds = [1, 2, 3, 4];
        
        const postRequests = boardIds.map(id => 
            fetch(`https://api.withchurch.site/api/posts?boardId=${id}&page=0&size=40`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            }).then(res => res.json())
        );

        const postResults = await Promise.all(postRequests);
        const allPosts = postResults.flatMap(result => result.data?.content || []);


        const commentRequests = allPosts.map(post => {
            const targetId = post.postId || post.id; 
            return fetch(`https://api.withchurch.site/api/comments?postId=${targetId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(json => {
                let list = [];
                if (json.data && Array.isArray(json.data.content)) {
                    list = json.data.content;
                } else if (Array.isArray(json.data)) {
                    list = json.data;
                }
                return { comments: list, parentPost: post };
            })
            .catch(() => ({ comments: [], parentPost: post }));
        });

        const commentsResult = await Promise.all(commentRequests);


        let allMyFoundComments = [];

        commentsResult.forEach(({ comments, parentPost }) => {
            if (!comments || comments.length === 0) return;

            const myOnes = comments.filter(c => {
                 const authorName = c.UserName || c.userName || c.writer;
                 return authorName === user.id || authorName === realName;
            });

            const formatted = myOnes.map(c => ({
                id: c.commentId,
                content: c.content,
                postId: parentPost.postId || parentPost.id, 
                category: boardIdToName[parentPost.boardId] || "기타", 
                date: c.createdAt ? c.createdAt.split("T")[0] : "",
            }));

            allMyFoundComments = [...allMyFoundComments, ...formatted];
        });

        allMyFoundComments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyComments(allMyFoundComments);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  if (loading) return <div className="mycomments-wrapper">로딩 중...</div>;
  

  return (
    <div className="mycomments-wrapper">
      <h2 className="mycomments-title">내 댓글</h2>
      <p className="mycomments-sub">
        {displayName}님은 총 {myComments.length}개의 댓글을 작성하셨습니다.
      </p>

      <div className="mycomments-list">
        {myComments.length === 0 ? (
          <div className="mycomments-empty">작성한 댓글이 없습니다.</div>
        ) : (
          myComments.map((c) => (
            <div
              key={c.id}
              className="mycomments-item"
              onClick={() =>
                navigate(`${categoryMap[c.category]}/${c.postId}`)
              }
            >
              <div className="mycomments-category">{c.category}</div>
              <div className="mycomments-content">{c.content}</div>

              <div className="mycomments-meta">
                {c.date} · 해당 글 바로가기 →
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}