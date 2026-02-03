import React, { useState } from "react";
import "./SignupPage.css";
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
      <h2 className="signup-title">
        <span className="signup-highlight">With Church</span>에 오신 걸 환영합니다!
      </h2>

      <div className="signup-card">
        <div className="signup-card-header">
          <span className="signup-required-text">✔ 필수 입력</span>
        </div>

        <div className="signup-form">
          {/* 아이디 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <User size={23} />
              <span>아이디</span>
            </div>
            <input
              type="text"
              className="signup-input"
              placeholder="아이디"
              value={form.loginId}
              onChange={handleChange("loginId")}
            />
          </div>

          {/* 비밀번호 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <LockKeyhole size={23} />
              <span>비밀번호</span>
            </div>
            <input
              type="password"
              className="signup-input"
              placeholder="영문/숫자/특수문자 8~15자"
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>

          {/* 비밀번호 재입력 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <LockKeyhole size={23} />
              <span>비밀번호 재입력</span>
            </div>
            <input
              type="password"
              className="signup-input"
              placeholder="비밀번호 재입력"
              value={form.passwordCheck}
              onChange={handleChange("passwordCheck")}
            />
          </div>

          {/* 이름 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <IdCard size={23} />
              <span>이름</span>
            </div>
            <input
              type="text"
              className="signup-input"
              placeholder="이름"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>

          {/* 휴대폰 번호 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <Smartphone size={23} />
              <span>휴대폰 번호</span>
            </div>
            <input
              type="tel"
              className="signup-input"
              placeholder="01012345678"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
          </div>

          {/* 성별 */}
          <div className="signup-row">
            <div className="signup-label">
              <VenusAndMars size={23} />
              <span>성별</span>
            </div>
            <div className="signup-inline">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  onChange={handleChange("gender")}
                />{" "}
                남
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  onChange={handleChange("gender")}
                />{" "}
                여
              </label>
            </div>
          </div>

          {/* 이메일 */}
          <div className="signup-row signup-row-required">
            <div className="signup-label">
              <Mail size={23} />
              <span>이메일</span>
            </div>
            <input
              type="email"
              className="signup-input"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          {/* 생년월일 (UI만 유지, 전송 안 함) */}
          <div className="signup-row">
            <div className="signup-label">
              <CalendarDays size={23} />
              <span>생년월일</span>
            </div>

            <div className="signup-birth">
              <input
                type="date"
                className="signup-input"
                placeholder="YYYY-MM-DD"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </div>
          </div>


          {/* 완료 버튼 */}
          <div className="signup-btn-wrap">
            <button className="signup-button" onClick={handleSignupComplete}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
