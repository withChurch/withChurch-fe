// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import "./App.css";

//  권한 라우트들
import PublicRoute from "./routes/PublicRoute";
import AuthRoute from "./routes/AuthRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

// Auth
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import SignupAgreePage from "./pages/Auth/SignupAgreePage";
import SignupCompletePage from "./pages/Auth/SignupCompletePage";
import FindIdPage from "./pages/Auth/FindIdPage";
import FindPasswordPage from "./pages/Auth/FindPasswordPage";
import FindIdResultPage from "./pages/Auth/FindIdResultPage";
import FindPasswordResultPage from "./pages/Auth/FindPasswordResultPage";
import ProfilePage from "./pages/Auth/ProfilePage";
import ProfileEditPage from "./pages/Auth/ProfileEditPage";
import PasswordEditPage from "./pages/Auth/PasswordEditPage";
import MyPostsPage from "./pages/Auth/MyPostsPage";
import MyCommentsPage from "./pages/Auth/MyCommentsPage";
import OfferingInfoPage from "./pages/Auth/OfferingInfoPage";

// About
import GreetingPage from "./pages/About/GreetingPage";
import WorshipInfoPage from "./pages/About/WorshipInfoPage";
import PastorPage from "./pages/About/PastorPage";
import OfferingPage from "./pages/About/OfferingPage";
import LocationPage from "./pages/About/LocationPage";

// News
import NoticesPage from "./pages/News/NoticesPage";
import NoticeDetailPage from "./pages/News/NoticeDetailPage";
import NoticeWritePage from "./pages/News/NoticeWritePage";
import NoticeEditPage from "./pages/News/NoticeEditPage";
import UpdatesPage from "./pages/News/UpdatesPage";
import UpdateDetailPage from "./pages/News/UpdateDetailPage";
import UpdateWritePage from "./pages/News/UpdateWritePage";
import UpdateEditPage from "./pages/News/UpdateEditPage";

// Sermon
import SundaySermonPage from "./pages/Sermon/SundaySermonPage";
import DawnSermonPage from "./pages/Sermon/DawnSermonPage";
import DawnSermonListPage from "./pages/Sermon/DawnSermonListPage";
import SundaySermonListPage from "./pages/Sermon/SundaySermonListPage";
import SundaySermonWritePage from "./pages/Sermon/SundaySermonWritePage";
import DawnSermonWritePage from "./pages/Sermon/DawnSermonWritePage";
import SundaySermonEditPage from "./pages/Sermon/SundaySermonEditPage";
import DawnSermonEditPage from "./pages/Sermon/DawnSermonEditPage";

// Community
import BoardListPage from "./pages/Community/BoardListPage";
import BoardWritePage from "./pages/Community/BoardWritePage";
import BoardDetailPage from "./pages/Community/BoardDetailPage";
import BoardEditPage from "./pages/Community/BoardEditPage";
import PrayerListPage from "./pages/Community/PrayerListPage";
import PrayerWritePage from "./pages/Community/PrayerWritePage";
import PrayerDetailPage from "./pages/Community/PrayerDetailPage";
import PrayerEditPage from "./pages/Community/PrayerEditPage";

import ScrollToTop from "./components/common/ScrollToTop";
import { BoardProvider } from "./contexts/BoardContext";
import { SermonProvider } from "./contexts/SermonContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SermonProvider>
        <BoardProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar />

            <main className="main-content">
              <Routes>
                {/* -------------------- PUBLIC -------------------- */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <MainPage />
                    </PublicRoute>
                  }
                />

                {/* 로그인/회원가입 계열 = 로그인 상태면 못 들어오게 (PublicOnlyRoute) */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup/agree"
                  element={
                    <PublicOnlyRoute>
                      <SignupAgreePage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicOnlyRoute>
                      <SignupPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup/complete"
                  element={
                    <PublicOnlyRoute>
                      <SignupCompletePage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/find-id"
                  element={
                    <PublicOnlyRoute>
                      <FindIdPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/find-password"
                  element={
                    <PublicOnlyRoute>
                      <FindPasswordPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/find-id/result"
                  element={
                    <PublicOnlyRoute>
                      <FindIdResultPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/find-password/result"
                  element={
                    <PublicOnlyRoute>
                      <FindPasswordResultPage />
                    </PublicOnlyRoute>
                  }
                />

                {/* About (전부 공개) */}
                <Route
                  path="/about/greeting"
                  element={
                    <PublicRoute>
                      <GreetingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/about/worship-info"
                  element={
                    <PublicRoute>
                      <WorshipInfoPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/about/pastor"
                  element={
                    <PublicRoute>
                      <PastorPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/about/offering"
                  element={
                    <PublicRoute>
                      <OfferingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/about/location"
                  element={
                    <PublicRoute>
                      <LocationPage />
                    </PublicRoute>
                  }
                />

                {/* News 조회 = 공개 */}
                <Route
                  path="/news/notices"
                  element={
                    <PublicRoute>
                      <NoticesPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/news/notices/:id"
                  element={
                    <PublicRoute>
                      <NoticeDetailPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/news/updates"
                  element={
                    <PublicRoute>
                      <UpdatesPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/news/updates/:id"
                  element={
                    <PublicRoute>
                      <UpdateDetailPage />
                    </PublicRoute>
                  }
                />

                {/* Sermon 조회 = 공개 */}
                <Route
                  path="/sermon/sunday"
                  element={
                    <PublicRoute>
                      <SundaySermonListPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/sermon/sunday/:id"
                  element={
                    <PublicRoute>
                      <SundaySermonPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/sermon/dawn"
                  element={
                    <PublicRoute>
                      <DawnSermonListPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/sermon/dawn/:id"
                  element={
                    <PublicRoute>
                      <DawnSermonPage />
                    </PublicRoute>
                  }
                />

                {/* Community 조회 = 공개 */}
                <Route
                  path="/community/board"
                  element={
                    <PublicRoute>
                      <BoardListPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/community/board/:id"
                  element={
                    <PublicRoute>
                      <BoardDetailPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/community/prayer"
                  element={
                    <PublicRoute>
                      <PrayerListPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/community/prayer/:id"
                  element={
                    <PublicRoute>
                      <PrayerDetailPage />
                    </PublicRoute>
                  }
                />

                {/* -------------------- AUTH (로그인 필요) -------------------- */}
                <Route
                  path="/profile"
                  element={
                    <AuthRoute>
                      <ProfilePage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <AuthRoute>
                      <ProfileEditPage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/profile/password"
                  element={
                    <AuthRoute>
                      <PasswordEditPage />
                    </AuthRoute>
                  }
                />

                <Route
                  path="/mypage/posts"
                  element={
                    <AuthRoute>
                      <MyPostsPage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/mypage/comments"
                  element={
                    <AuthRoute>
                      <MyCommentsPage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/mypage/offering"
                  element={
                    <AuthRoute>
                      <OfferingInfoPage />
                    </AuthRoute>
                  }
                />
                
                {/* 커뮤니티 글쓰기/수정 (지금은 Admin 전용으로 가정) */}
                <Route
                  path="/community/board/write"
                  element={
                    <AuthRoute>
                      <BoardWritePage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/community/board/edit/:id"
                  element={
                    <AuthRoute>
                      <BoardEditPage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/community/prayer/write"
                  element={
                    <AuthRoute>
                      <PrayerWritePage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/community/prayer/edit/:id"
                  element={
                    <AuthRoute>
                      <PrayerEditPage />
                    </AuthRoute>
                  }
                />

                {/* -------------------- ADMIN -------------------- */}
                {/* 공지/소식 쓰기/수정 */}
                <Route
                  path="/news/notices/write"
                  element={
                    <AdminRoute>
                      <NoticeWritePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/news/notices/edit/:id"
                  element={
                    <AdminRoute>
                      <NoticeEditPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/news/updates/write"
                  element={
                    <AdminRoute>
                      <UpdateWritePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/news/updates/edit/:id"
                  element={
                    <AdminRoute>
                      <UpdateEditPage />
                    </AdminRoute>
                  }
                />

                {/* 설교 쓰기/수정 */}
                <Route
                  path="/sermon/sunday/write"
                  element={
                    <AdminRoute>
                      <SundaySermonWritePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/sermon/sunday/:id/edit"
                  element={
                    <AdminRoute>
                      <SundaySermonEditPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/sermon/dawn/write"
                  element={
                    <AdminRoute>
                      <DawnSermonWritePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/sermon/dawn/:id/edit"
                  element={
                    <AdminRoute>
                      <DawnSermonEditPage />
                    </AdminRoute>
                  }
                />


                {/* 403 (권한 없음) */}
                <Route path="/403" element={<div>접근 권한이 없습니다.</div>} />
              </Routes>
            </main>

            <Footer />
          </BrowserRouter>
        </BoardProvider>
      </SermonProvider>
    </AuthProvider>
  );
}

export default App;
