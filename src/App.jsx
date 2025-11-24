// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import "./App.css";

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
import SundaySermonWritePage from "./pages/Sermon/SundaySermonWritePage"
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

function App() {
  return (
    <SermonProvider>
    <BoardProvider>
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Main */}
          <Route path="/" element={<MainPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          {/* 1단계: 약관 동의 */}
          <Route path="/signup/agree" element={<SignupAgreePage />} />
          {/* 2단계: 정보 입력 (기존 회원가입 페이지) */}
          <Route path="/signup" element={<SignupPage />} />
          {/* 3단계: 회원가입 완료 페이지 */}
          <Route path="/signup/complete" element={<SignupCompletePage />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/find-password" element={<FindPasswordPage />} />
          <Route path="/find-id/result" element={<FindIdResultPage />} />
          <Route path="/find-password/result" element={<FindPasswordResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/password" element={<PasswordEditPage />} />

          <Route path="/mypage/posts" element={<MyPostsPage />} />
          <Route path="/mypage/comments" element={<MyCommentsPage />} />
          <Route path="/mypage/offering" element={<OfferingInfoPage />} />


          {/* About */}
          <Route path="/about/greeting" element={<GreetingPage />} />
          <Route path="/about/worship-info" element={<WorshipInfoPage />} />
          <Route path="/about/pastor" element={<PastorPage />} />
          <Route path="/about/offering" element={<OfferingPage />} />
          <Route path="/about/location" element={<LocationPage />} />

          {/* News */}
          <Route path="/news/notices" element={<NoticesPage />} />
          <Route path="/news/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/news/notices/write" element={<NoticeWritePage />} />
          <Route path="/news/notices/edit/:id" element={<NoticeEditPage />} />
          <Route path="/news/updates" element={<UpdatesPage />} />
          <Route path="/news/updates/:id" element={<UpdateDetailPage />} />
          <Route path="/news/updates/write" element={<UpdateWritePage />} />
          <Route path="/news/updates/edit/:id" element={<UpdateEditPage />} />

          {/* Sermon */}
          <Route path="/sermon/sunday" element={<SundaySermonListPage />} />
          <Route path="/sermon/sunday/write" element={<SundaySermonWritePage />} />
          <Route path="/sermon/sunday/:id" element={<SundaySermonPage />} />
          <Route path="/sermon/sunday/:id/edit" element={<SundaySermonEditPage />} />

          <Route path="/sermon/dawn" element={<DawnSermonListPage />} />
          <Route path="/sermon/dawn/write" element={<DawnSermonWritePage />} /> 
          <Route path="/sermon/dawn/:id" element={<DawnSermonPage />} />
          <Route path="/sermon/dawn/:id/edit" element={<DawnSermonEditPage />} />


          {/* Community */}
          <Route path="/community/board" element={<BoardListPage />} />
          <Route path="/community/board/write" element={<BoardWritePage />} />
          <Route path="/community/board/:id" element={<BoardDetailPage />} />
          <Route path="/community/board/edit/:id" element={<BoardEditPage />} />
          <Route path="/community/prayer" element={<PrayerListPage />} />
          <Route path="/community/prayer/write" element={<PrayerWritePage />} />
          <Route path="/community/prayer/:id" element={<PrayerDetailPage />} />
          <Route path="/community/prayer/edit/:id" element={<PrayerEditPage />} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
    </BoardProvider>
    </SermonProvider>
  );
}

export default App;
