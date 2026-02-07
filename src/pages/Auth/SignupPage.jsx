import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LockKeyhole,
  User,
  IdCard,
  Smartphone,
  VenusAndMars,
  Mail,
  CalendarDays,
} from "lucide-react";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  /* =======================
      회원가입 form state
  ======================= */
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
    phoneNumber: "",
    email: "",
    gender: "",
  });
  const [birth, setBirth] = useState("");

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  /* =======================
      회원가입 처리
  ======================= */
  const handleSignupComplete = async () => {
    const {
      loginId,
      password,
      passwordCheck,
      name,
      phoneNumber,
      email,
      gender,
    } = form;

    // 필수값 체크
    if (!loginId || !password || !passwordCheck || !name || !phoneNumber || !email) {
      alert("필수 입력 항목을 모두 입력해 주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호와 비밀번호 재입력이 일치하지 않습니다.");
      return;
    }

    try {
      const birthAt = birth;

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        {
          loginId,
          password,
          name,
          phoneNumber,
          email,
          gender,
          birthAt,
        }
      );

      navigate("/signup/complete");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* 상단 로고 */}
        <h1 className="logo-text">WithChurch</h1>
        
        <div className="divider-line"></div>

        {/* 단계 표시 (Step 2 활성화) */}
        <div className="step-indicator">
          {/* Step 1: 완료됨 (회색 처리 or 체크표시 등 자유롭게, 여기선 기본 회색) */}
          <div className="step-item">
            <div className="step-circle completed"></div>
            <span className="step-text">1. 이용 약관</span>
          </div>
          <div className="step-line active-line"></div>
          
          {/* Step 2: 현재 활성화 (녹색) */}
          <div className="step-item active">
            <div className="step-circle"></div>
            <span className="step-text">2. 정보 입력</span>
          </div>
          <div className="step-line"></div>

          {/* Step 3: 미완료 */}
          <div className="step-item">
            <div className="step-circle empty"></div>
            <span className="step-text">3. 신청 완료</span>
          </div>
        </div>

        {/* 타이틀 */}
        <div className="content-header">
          <h2>WithChurch 회원가입</h2>
          <p>회원 정보를 입력해주세요</p>
        </div>

        {/* 입력 폼 카드 */}
        <div className="signup-form-card">
          <div className="form-header-row">
             <span className="signup-required-text">✔ 필수 입력</span>
          </div>

          {/* 아이디 */}
          <div className="signup-row">
            <label className="signup-label">
              <User size={18} />
              <span>아이디 <span className="req-star">*</span></span>
            </label>
            <input
              type="text"
              className="signup-input"
              placeholder="아이디를 입력하세요"
              value={form.loginId}
              onChange={handleChange("loginId")}
            />
          </div>

          {/* 비밀번호 */}
          <div className="signup-row">
            <label className="signup-label">
              <LockKeyhole size={18} />
              <span>비밀번호 <span className="req-star">*</span></span>
            </label>
            <input
              type="password"
              className="signup-input"
              placeholder="영문/숫자/특수문자 8~15자"
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-row">
            <label className="signup-label">
              <LockKeyhole size={18} />
              <span>비밀번호 재입력 <span className="req-star">*</span></span>
            </label>
            <input
              type="password"
              className="signup-input"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordCheck}
              onChange={handleChange("passwordCheck")}
            />
          </div>

          {/* 이름 */}
          <div className="signup-row">
            <label className="signup-label">
              <IdCard size={18} />
              <span>이름 <span className="req-star">*</span></span>
            </label>
            <input
              type="text"
              className="signup-input"
              placeholder="성함을 입력하세요"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>

          {/* 휴대폰 번호 */}
          <div className="signup-row">
            <label className="signup-label">
              <Smartphone size={18} />
              <span>휴대폰 번호 <span className="req-star">*</span></span>
            </label>
            <input
              type="tel"
              className="signup-input"
              placeholder="010-0000-0000"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
          </div>

          {/* 이메일 */}
          <div className="signup-row">
            <label className="signup-label">
              <Mail size={18} />
              <span>이메일 <span className="req-star">*</span></span>
            </label>
            <input
              type="email"
              className="signup-input"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          {/* 성별 & 생년월일 (한 줄에 배치하거나 나란히) */}
          <div className="signup-row-group">
            {/* 성별 */}
            <div className="signup-row half">
              <label className="signup-label">
                <VenusAndMars size={18} />
                <span>성별</span>
              </label>
              <div className="radio-group">
                <label className={`radio-label ${form.gender === 'MALE' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    onChange={handleChange("gender")}
                  />
                  남성
                </label>
                <label className={`radio-label ${form.gender === 'FEMALE' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    onChange={handleChange("gender")}
                  />
                  여성
                </label>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="signup-row half">
              <label className="signup-label">
                <CalendarDays size={18} />
                <span>생년월일</span>
              </label>
              <input
                type="date"
                className="signup-input"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </div>
          </div>

          {/* 완료 버튼 */}
          <button className="signup-button" onClick={handleSignupComplete}>
            회원가입 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;