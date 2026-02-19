import React, { useEffect, useMemo, useRef, useState } from "react";
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

// mm:ss 포맷터
function formatMMSS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// 6자리 OTP 입력 컴포넌트
function OtpInput({ value, onChange, length = 6, disabled }) {
  const refs = useRef([]);

  const digits = useMemo(() => {
    return Array.from({ length }, (_, i) => value?.[i] || "");
  }, [value, length]);

  const setAt = (idx, ch) => {
    const next = digits.slice();
    next[idx] = ch;
    onChange(next.join("").slice(0, length));
  };

  const focus = (idx) => {
    const el = refs.current[idx];
    if (el) el.focus();
  };

  const handleChange = (idx) => (e) => {
    const raw = e.target.value;
    const only = raw.replace(/\D/g, "");
    if (!only) {
      setAt(idx, "");
      return;
    }
    const last = only[only.length - 1];
    setAt(idx, last);
    if (idx < length - 1) focus(idx + 1);
  };

  const handleKeyDown = (idx) => (e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setAt(idx, "");
        return;
      }
      if (idx > 0) focus(idx - 1);
    }
    if (e.key === "ArrowLeft" && idx > 0) focus(idx - 1);
    if (e.key === "ArrowRight" && idx < length - 1) focus(idx + 1);
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    const only = text.replace(/\D/g, "").slice(0, length);
    if (!only) return;
    e.preventDefault();
    onChange(only);
    focus(Math.min(only.length, length - 1));
  };

  return (
    <div className="otp-boxes" onPaste={handlePaste}>
      {digits.map((d, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          className="otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d}
          onChange={handleChange(idx)}
          onKeyDown={handleKeyDown(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();

  const BASE = import.meta.env.VITE_API_BASE_URL;

  const AUTH_BASE = useMemo(() => {
    const b = String(BASE || "").replace(/\/+$/, "");
    if (b.endsWith("/api/auth")) return b;
    if (b.endsWith("/auth")) return b;
    if (b.endsWith("/api")) return `${b}/auth`;
    return `${b}/api/auth`;
  }, [BASE]);

  const getErrMsg = (e, fallback) => {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.response?.data?.msg ||
      e?.message;
    return msg || fallback;
  };

  const ensureApiSuccess = (res) => {
    const d = res?.data;
    if (d && typeof d === "object" && d.success === false) {
      const err = new Error(d.message || "요청에 실패했습니다.");
      err.response = { status: res.status, data: d };
      throw err;
    }
    return res;
  };

  // 이메일 중복 에러 판별
  const isDuplicateEmailError = (e) => {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    const msg = getErrMsg(e, "");

    if (status === 409) return true;
    if (
      typeof code === "string" &&
      /EMAIL/i.test(code) &&
      /(DUPLICATE|EXIST|ALREADY)/i.test(code)
    ) {
      return true;
    }
    if (/이미\s*사용|중복|가입된\s*이메일/.test(msg)) return true;
    return false;
  };

  /* =======================
       Form State
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
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  /* =======================
       아이디 중복확인
  ======================= */
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(null); // null | true | false
  const [idMessage, setIdMessage] = useState("");
  const [checkedLoginId, setCheckedLoginId] = useState("");

  useEffect(() => {
    if (form.loginId.trim() !== checkedLoginId) {
      setIdChecked(false);
      setIdAvailable(null);
      setIdMessage("");
    }
  }, [form.loginId, checkedLoginId]);

  const parseIdAvailability = (data) => {
    if (data == null) return null;
    if (typeof data === "boolean") return !data;
    if (typeof data.available === "boolean") return data.available;
    if (typeof data.isAvailable === "boolean") return data.isAvailable;
    if (typeof data.exists === "boolean") return !data.exists;
    if (typeof data.duplicated === "boolean") return !data.duplicated;
    if (typeof data.isDuplicated === "boolean") return !data.isDuplicated;
    if (typeof data.duplicate === "boolean") return !data.duplicate;
    if (typeof data.data === "boolean") return !data.data;
    return null;
  };

  const handleCheckLoginId = async () => {
    const loginId = form.loginId.trim();
    if (!loginId) {
      alert("아이디를 입력해 주세요.");
      return;
    }

    setIdCheckLoading(true);
    try {
      const res = await axios.get(`${AUTH_BASE}/check-login-id`, {
        params: { loginId },
      });

      const available = parseIdAvailability(res.data);

      if (available === null) {
        console.warn("[check-login-id] Unknown response format:", res.data);
        setIdAvailable(true);
        setIdChecked(true);
        setCheckedLoginId(loginId);
        setIdMessage("사용 가능한 아이디입니다.");
        return;
      }

      setIdAvailable(available);
      setIdChecked(true);
      setCheckedLoginId(loginId);
      setIdMessage(
        available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."
      );
    } catch (e) {
      console.error(e);
      setIdChecked(false);
      setIdAvailable(null);
      setIdMessage(getErrMsg(e, "아이디 중복확인에 실패했습니다."));
    } finally {
      setIdCheckLoading(false);
    }
  };

  /* =======================
       이메일 인증 State
  ======================= */
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [expiresAt, setExpiresAt] = useState(0);
  const [remainMs, setRemainMs] = useState(0);

  const normalizeEmail = (v) => String(v || "").trim().toLowerCase();
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // 이메일 입력창 하단 메시지 (중복 등)
  const [emailFieldMessage, setEmailFieldMessage] = useState("");
  const [emailFieldIsError, setEmailFieldIsError] = useState(false);

  // 재전송 쿨다운 (30초)
  const RESEND_COOLDOWN_SEC = 30;
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [resendRemainSec, setResendRemainSec] = useState(0);

  useEffect(() => {
    const current = normalizeEmail(form.email);
    if (current !== verifiedEmail) {
      setEmailVerified(false);
    }
    // 이메일 변경 시 상태 초기화
    setEmailSent(false);
    setVerificationCode("");
    setEmailMessage("");
    setEmailFieldMessage("");
    setEmailFieldIsError(false);
    setExpiresAt(0);
    setRemainMs(0);
    setResendAvailableAt(0);
    setResendRemainSec(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email]);

  // 타이머 (인증 만료)
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => setRemainMs(Math.max(0, expiresAt - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  // 타이머 (재전송 대기)
  useEffect(() => {
    if (!resendAvailableAt) {
      setResendRemainSec(0);
      return;
    }
    const tick = () => {
      const remain = Math.max(
        0,
        Math.ceil((resendAvailableAt - Date.now()) / 1000)
      );
      setResendRemainSec(remain);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [resendAvailableAt]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const parseExpiresAt = (data) => {
    const raw =
      data?.expiresAt ??
      data?.expireAt ??
      data?.expiredAt ??
      data?.expires_at ??
      data?.expires_in;

    if (raw == null) return 0;

    if (typeof raw === "string") {
      const t = Date.parse(raw);
      if (!Number.isNaN(t)) return t;
      const n = Number(raw);
      if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
      return 0;
    }
    if (typeof raw === "number") {
      if (raw < 10_000) return Date.now() + raw * 1000;
      return raw < 1e12 ? raw * 1000 : raw;
    }
    return 0;
  };

  const handleSendEmailCode = async () => {
    const emailTrim = form.email.trim();

    if (!emailTrim) {
      alert("이메일을 입력해 주세요.");
      return;
    }
    if (!isValidEmail(emailTrim)) {
      alert("이메일 형식을 확인해 주세요.");
      return;
    }

    setEmailFieldMessage("");
    setEmailFieldIsError(false);

    if (emailVerified && verifiedEmail === normalizeEmail(emailTrim)) {
      setEmailFieldMessage("이미 이메일 인증이 완료되었습니다.");
      setEmailFieldIsError(false);
      return;
    }

    setEmailSending(true);
    try {
      const rawRes = await axios.post(
        `${AUTH_BASE}/signup/send-code`,
        { email: emailTrim },
        { params: { email: emailTrim } }
      );
      const res = ensureApiSuccess(rawRes);

      const exp =
        parseExpiresAt(res.data?.data ?? res.data) ||
        Date.now() + 3 * 60 * 1000;

      setEmailSent(true);
      setEmailVerified(false);
      setVerifiedEmail("");
      setVerificationCode("");
      setExpiresAt(exp);
      setEmailMessage("인증번호를 전송했어요. 이메일을 확인해 주세요.");

      // 재전송 쿨다운 설정
      setResendAvailableAt(Date.now() + RESEND_COOLDOWN_SEC * 1000);
      setResendRemainSec(RESEND_COOLDOWN_SEC);
    } catch (e) {
      console.error(e);
      const msg = getErrMsg(e, "인증번호 전송에 실패했습니다.");

      // 중복 이메일인 경우 OTP창 열지 않고 메시지만 표시
      if (isDuplicateEmailError(e)) {
        setEmailSent(false);
        setVerificationCode("");
        setEmailMessage("");
        setExpiresAt(0);
        setRemainMs(0);
        setResendAvailableAt(0);
        setResendRemainSec(0);

        setEmailFieldMessage(msg);
        setEmailFieldIsError(true);
        return;
      }

      // 일반 오류
      if (!emailSent) {
        setEmailFieldMessage(msg);
        setEmailFieldIsError(true);
      } else {
        setEmailMessage(msg);
      }
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    const emailTrim = form.email.trim();
    const emailNorm = normalizeEmail(form.email);

    if (!emailSent) {
      alert("먼저 인증번호를 전송해 주세요.");
      return;
    }
    if (remainMs <= 0) {
      alert("인증번호가 만료되었습니다. 다시 전송해 주세요.");
      return;
    }
    if (verificationCode.length !== 6) {
      alert("6자리 인증번호를 입력해 주세요.");
      return;
    }

    setEmailVerifying(true);
    try {
      const rawRes = await axios.post(
        `${AUTH_BASE}/signup/verify-code`,
        null, // swagger처럼 body 없이
        { params: { email: emailTrim, code: verificationCode } }
      );
      ensureApiSuccess(rawRes);

      setEmailVerified(true);
      setVerifiedEmail(emailNorm);

      setEmailMessage("");

      setEmailFieldMessage("이메일 인증이 완료되었습니다.");
      setEmailFieldIsError(false);
    } catch (e) {
      console.error(e);
      setEmailVerified(false);
      setEmailMessage(
        getErrMsg(e, "인증번호가 올바르지 않거나 만료되었습니다.")
      );
    } finally {
      setEmailVerifying(false);
    }
  };

  /* =======================
       회원가입 완료 처리
  ======================= */
  const canSubmit = useMemo(() => {
    const { loginId, password, passwordCheck, name, phoneNumber, email } = form;

    const requiredOk =
      loginId && password && passwordCheck && name && phoneNumber && email;
    const pwOk = password && passwordCheck && password === passwordCheck;

    const idOk =
      idChecked && idAvailable === true && checkedLoginId === loginId.trim();

    const emailOk =
      emailVerified &&
      verifiedEmail === normalizeEmail(email) &&
      verificationCode.length === 6;

    return requiredOk && pwOk && idOk && emailOk;
  }, [
    form,
    idChecked,
    idAvailable,
    checkedLoginId,
    emailVerified,
    verifiedEmail,
    verificationCode,
  ]);

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

    if (
      !loginId ||
      !password ||
      !passwordCheck ||
      !name ||
      !phoneNumber ||
      !email
    ) {
      alert("필수 입력 항목을 모두 입력해 주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (
      !(idChecked && idAvailable === true && checkedLoginId === loginId.trim())
    ) {
      alert("아이디 중복확인을 완료해 주세요.");
      return;
    }

    if (
      !(
        emailVerified &&
        verifiedEmail === normalizeEmail(email) &&
        verificationCode.length === 6
      )
    ) {
      alert("이메일 인증을 완료해 주세요.");
      return;
    }

    try {
      await axios.post(`${AUTH_BASE}/signup`, {
        loginId: loginId.trim(),
        password,
        name,
        phoneNumber,
        email: email.trim(),
        gender,
        birthAt: birth || null,
        verificationCode,
      });

      navigate("/signup/complete", { state: { userName: name } });

    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(getErrMsg(error, "회원가입에 실패했습니다."));
    }
  };
  const resendLocked = emailSent && resendRemainSec > 0;

  const sendBtnText = emailSending
    ? "전송중..."
    : emailVerified
    ? "인증완료"
    : emailSent
    ? resendLocked
      ? `전송됨 (${resendRemainSec}s)`
      : "재전송"
    : "인증번호 전송";

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="logo-text">WithChurch</h1>

        <div className="divider-line"></div>

        <div className="step-indicator">
          <div className="step-item">
            <div className="step-circle completed"></div>
            <span className="step-text">1. 이용 약관</span>
          </div>
          <div className="step-line active-line"></div>

          <div className="step-item active">
            <div className="step-circle"></div>
            <span className="step-text">2. 정보 입력</span>
          </div>
          <div className="step-line"></div>

          <div className="step-item">
            <div className="step-circle empty"></div>
            <span className="step-text">3. 신청 완료</span>
          </div>
        </div>

        <div className="content-header">
          <h2>WithChurch 회원가입</h2>
          <p>회원 정보를 입력해주세요</p>
        </div>

        <div className="signup-form-card">
          <div className="form-header-row">
            <span className="signup-required-text">✔ 필수 입력</span>
          </div>

          {/* 아이디 */}
          <div className="signup-row">
            <label className="signup-label">
              <User size={18} />
              <span>
                아이디 <span className="req-star">*</span>
              </span>
            </label>

            <div className="input-with-button">
              <input
                type="text"
                className="signup-input"
                placeholder="아이디를 입력하세요"
                value={form.loginId}
                onChange={handleChange("loginId")}
              />
              <button
                type="button"
                className="inner-btn"
                onClick={handleCheckLoginId}
                disabled={idCheckLoading || !form.loginId.trim()}
              >
                {idCheckLoading ? "확인중..." : "중복확인"}
              </button>
            </div>

            {idMessage && (
              <div className={`field-message ${idAvailable ? "ok" : "bad"}`}>
                {idMessage}
              </div>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="signup-row">
            <label className="signup-label">
              <LockKeyhole size={18} />
              <span>
                비밀번호 <span className="req-star">*</span>
              </span>
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
              <span>
                비밀번호 재입력 <span className="req-star">*</span>
              </span>
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
              <span>
                이름 <span className="req-star">*</span>
              </span>
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
              <span>
                휴대폰 번호 <span className="req-star">*</span>
              </span>
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
              <span>
                이메일 <span className="req-star">*</span>
              </span>
            </label>

            <div className="input-with-button">
              <input
                type="email"
                className="signup-input"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange("email")}
                disabled={
                  emailVerified && verifiedEmail === normalizeEmail(form.email)
                }
              />
              <button
                type="button"
                className="inner-btn"
                onClick={handleSendEmailCode}
                disabled={
                  emailSending ||
                  !form.email.trim() ||
                  emailVerified ||
                  resendLocked
                }
              >
                {sendBtnText}
              </button>
            </div>

            {emailFieldMessage && (
              <div
                className={`field-message ${
                  emailFieldIsError ? "bad" : "ok"
                } email-field-msg`}
              >
                {emailFieldMessage}
              </div>
            )}
          </div>

          {emailSent && !emailVerified && (
            <div className="signup-row otp-section">
              <div className="otp-header">
                <span className="otp-label-text">인증번호 입력</span>
                <span className="timer">{formatMMSS(remainMs)}</span>
              </div>

              <div className="otp-input-group">
                <OtpInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                  disabled={emailVerified}
                />
                <button
                  type="button"
                  className="otp-confirm-btn"
                  onClick={handleVerifyEmailCode}
                  disabled={emailVerifying || emailVerified}
                >
                  {emailVerified ? "완료" : emailVerifying ? "..." : "확인"}
                </button>
              </div>

              {emailMessage && (
                <div
                  className={`field-message ${emailVerified ? "ok" : "bad"}`}
                  style={{ marginLeft: 0, marginTop: "8px" }}
                >
                  {emailMessage}
                </div>
              )}
            </div>
          )}

          {/* 성별 & 생년월일 */}
          <div className="signup-row-group">
            <div className="signup-row half">
              <label className="signup-label">
                <VenusAndMars size={18} />
                <span>성별</span>
              </label>
              <div className="radio-group">
                <label
                  className={`radio-label ${
                    form.gender === "MALE" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    onChange={handleChange("gender")}
                  />
                  남성
                </label>
                <label
                  className={`radio-label ${
                    form.gender === "FEMALE" ? "selected" : ""
                  }`}
                >
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
          <button
            className="signup-button"
            onClick={handleSignupComplete}
            disabled={!canSubmit}
          >
            회원가입 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
