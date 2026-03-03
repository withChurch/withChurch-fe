import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
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
function OtpInput({ value, onChange, length = 6, disabled, firstRef }) {
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
          ref={(el) => {
            refs.current[idx] = el;
            if (idx === 0 && firstRef) firstRef.current = el;
          }}
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

  const normalizeEmail = (v) => String(v || "").trim().toLowerCase();

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


  const [submitTried, setSubmitTried] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const loginIdRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const emailSendBtnRef = useRef(null);
  const otpFirstRef = useRef(null);

  const scrollAndFocus = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    }, 300);
  };

  /* =======================
       아이디 자동 중복확인
  ======================= */
  const ID_CHECK_DEBOUNCE_MS = 500;

  const [idCheckPending, setIdCheckPending] = useState(false);
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(null); // null | true | false
  const [idMessage, setIdMessage] = useState("");
  const [checkedLoginId, setCheckedLoginId] = useState("");

  const idCheckSeq = useRef(0);

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

  useEffect(() => {
    const loginId = form.loginId.trim();

    if (!loginId) {
      idCheckSeq.current += 1;
      setIdCheckPending(false);
      setIdCheckLoading(false);
      setIdChecked(false);
      setIdAvailable(null);
      setCheckedLoginId("");
      setIdMessage("");
      return;
    }

    if (loginId === checkedLoginId && idChecked && idAvailable !== null) {
      setIdCheckPending(false);
      return;
    }

    const seq = ++idCheckSeq.current;

    setIdCheckPending(true);
    setIdCheckLoading(false);
    setIdChecked(false);
    setIdAvailable(null);
    setIdMessage("");

    const t = setTimeout(async () => {
      if (seq !== idCheckSeq.current) return;

      setIdCheckPending(false);
      setIdCheckLoading(true);

      try {
        const rawRes = await api.get("/auth/check-login-id", {
          params: { loginId },
          skipAuth: true,
        });
        const res = ensureApiSuccess(rawRes);

        if (seq !== idCheckSeq.current) return;

        const available = parseIdAvailability(res.data?.data ?? res.data);


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
        if (seq !== idCheckSeq.current) return;
        console.error(e);
        setIdChecked(false);
        setIdAvailable(null);
        setCheckedLoginId("");
        setIdMessage(getErrMsg(e, "아이디 중복확인에 실패했습니다."));
      } finally {
        if (seq === idCheckSeq.current) setIdCheckLoading(false);
      }
    }, ID_CHECK_DEBOUNCE_MS);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.loginId]);

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

  useEffect(() => {
    if (emailSent && !emailVerified) {
      window.setTimeout(() => {
        otpFirstRef.current?.focus?.();
      }, 0);
    }
  }, [emailSent, emailVerified]);

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
      scrollAndFocus(emailRef.current);
      return;
    }
    if (!isValidEmail(emailTrim)) {
      alert("이메일 형식을 확인해 주세요.");
      scrollAndFocus(emailRef.current);
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
      const rawRes = await api.post(
        "/auth/signup/send-code",
        { email: emailTrim },
        { params: { email: emailTrim }, skipAuth: true }
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
      scrollAndFocus(emailSendBtnRef.current || emailRef.current);
      return;
    }
    if (remainMs <= 0) {
      alert("인증번호가 만료되었습니다. 다시 전송해 주세요.");
      scrollAndFocus(emailSendBtnRef.current || emailRef.current);
      return;
    }
    if (verificationCode.length !== 6) {
      alert("6자리 인증번호를 입력해 주세요.");
      scrollAndFocus(otpFirstRef.current);
      return;
    }

    setEmailVerifying(true);
    try {
      const rawRes = await api.post("/auth/signup/verify-code", null, {
        params: { email: emailTrim, code: verificationCode },
        skipAuth: true,
      });
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
       검증/에러 메시지
  ======================= */
  const validateNow = () => {
    const errors = {};
    const loginIdTrim = form.loginId.trim();
    const emailTrim = form.email.trim();
    const emailNorm = normalizeEmail(emailTrim);

    // 아이디
    if (!loginIdTrim) {
      errors.loginId = "아이디를 입력해 주세요.";
    } else if (idCheckPending || idCheckLoading) {
      errors.loginId = "아이디 중복을 확인중입니다. 잠시만 기다려 주세요.";
    } else {
      const idOkLocal =
        idChecked && idAvailable === true && checkedLoginId === loginIdTrim;

      if (!idOkLocal) {
        if (idAvailable === false) {
          errors.loginId = "이미 사용 중인 아이디입니다.";
        } else if (idMessage) {
          errors.loginId = idMessage;
        } else {
          errors.loginId = "사용 가능한 아이디인지 확인이 필요합니다.";
        }
      }
    }

    // 비밀번호
    if (!form.password) {
      errors.password = "비밀번호를 입력해 주세요.";
    }

    if (!form.passwordCheck) {
      errors.passwordCheck = "비밀번호를 다시 입력해 주세요.";
    } else if (form.password && form.password !== form.passwordCheck) {
      errors.passwordCheck = "비밀번호가 일치하지 않습니다.";
    }

    // 이름/휴대폰
    if (!form.name.trim()) errors.name = "이름을 입력해 주세요.";
    if (!form.phoneNumber.trim())
      errors.phoneNumber = "휴대폰 번호를 입력해 주세요.";

    // 이메일
    if (!emailTrim) {
      errors.email = "이메일을 입력해 주세요.";
    } else if (!isValidEmail(emailTrim)) {
      errors.email = "이메일 형식을 확인해 주세요.";
    } else if (emailFieldIsError && emailFieldMessage) {
      errors.email = emailFieldMessage;
    } else if (!emailSent) {
      errors.email = "인증번호 전송 버튼을 눌러 주세요.";
    } else if (remainMs <= 0) {
      errors.email = "인증번호가 만료되었습니다. 재전송해 주세요.";
    } else {
      const emailOkLocal =
        emailVerified &&
        verifiedEmail === emailNorm &&
        verificationCode.length === 6;

      if (!emailOkLocal) {
        if (verificationCode.length !== 6) {
          errors.otp = "6자리 인증번호를 입력해 주세요.";
        } else {
          errors.otp = "인증번호 확인 버튼을 눌러 주세요.";
        }
      }
    }

    const order = [
      "loginId",
      "password",
      "passwordCheck",
      "name",
      "phoneNumber",
      "email",
      "otp",
    ];
    const firstKey = order.find((k) => errors[k]);
    return { errors, firstKey };
  };

  const canSubmit = useMemo(() => {
    const loginIdTrim = form.loginId.trim();
    const emailTrim = form.email.trim();

    const requiredOk =
      loginIdTrim &&
      form.password &&
      form.passwordCheck &&
      form.name.trim() &&
      form.phoneNumber.trim() &&
      emailTrim;

    const pwOk =
      form.password &&
      form.passwordCheck &&
      form.password === form.passwordCheck;

    const idOk =
      idChecked && idAvailable === true && checkedLoginId === loginIdTrim;

    const emailOk =
      emailVerified &&
      verifiedEmail === normalizeEmail(emailTrim) &&
      verificationCode.length === 6;

    return Boolean(requiredOk && pwOk && idOk && emailOk);
  }, [
    form,
    idChecked,
    idAvailable,
    checkedLoginId,
    emailVerified,
    verifiedEmail,
    verificationCode,
  ]);

  const focusFirstError = (firstKey, errors) => {
    if (!firstKey) return;

    if (firstKey === "loginId") return scrollAndFocus(loginIdRef.current);
    if (firstKey === "password") return scrollAndFocus(passwordRef.current);
    if (firstKey === "passwordCheck")
      return scrollAndFocus(passwordCheckRef.current);
    if (firstKey === "name") return scrollAndFocus(nameRef.current);
    if (firstKey === "phoneNumber") return scrollAndFocus(phoneRef.current);

    if (firstKey === "email") {
      if (
        errors?.email &&
        /만료|재전송/.test(errors.email) &&
        emailSendBtnRef.current
      ) {
        return scrollAndFocus(emailSendBtnRef.current);
      }
      return scrollAndFocus(emailRef.current);
    }

    if (firstKey === "otp") {
      if (remainMs <= 0 && emailSendBtnRef.current) {
        return scrollAndFocus(emailSendBtnRef.current);
      }
      return scrollAndFocus(otpFirstRef.current);
    }
  };

  /* =======================
       회원가입 완료 처리
  ======================= */
  const handleSignupComplete = async () => {
    setSubmitTried(true);

    if (!canSubmit) {
      const { errors, firstKey } = validateNow();
      alert("입력하지 않은 항목이 있어요. 빨간 안내 문구를 확인해 주세요.");
      window.setTimeout(() => focusFirstError(firstKey, errors), 0);
      return;
    }

    const {
      loginId,
      password,
      passwordCheck,
      name,
      phoneNumber,
      email,
      gender,
    } = form;

    setSignupLoading(true);
    try {
      await api.post(
      "/auth/signup",
      {
        loginId: loginId.trim(),
        password,
        passwordCheck,
        name,
        phoneNumber,
        email: email.trim(),
        gender,
        birthAt: birth || null,
        verificationCode,
      },
      { skipAuth: true }
    );

      navigate("/signup/complete", { state: { userName: name } });
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(getErrMsg(error, "회원가입에 실패했습니다."));
    } finally {
      setSignupLoading(false);
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

  const submitErrors = submitTried ? validateNow().errors : {};

  const idStatusText = (() => {
    const loginIdTrim = form.loginId.trim();
    if (!loginIdTrim) return "";
    if (idCheckPending || idCheckLoading) return "아이디 중복을 확인중입니다...";
    return idMessage;
  })();

  const idStatusClass = (() => {
    if (idCheckPending || idCheckLoading) return "field-message";
    if (idAvailable === true) return "field-message ok";
    if (idAvailable === false) return "field-message bad";
    return "field-message";
  })();

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

          <div className="signup-row">
            <label className="signup-label">
              <User size={18} />
              <span>
                아이디 <span className="req-star">*</span>
              </span>
            </label>

            <div className="input-with-button">
              <input
                ref={loginIdRef}
                type="text"
                className="signup-input"
                placeholder="아이디를 입력하세요"
                value={form.loginId}
                onChange={handleChange("loginId")}
              />
            </div>

            {/* 자동 중복확인 상태 메시지 */}
            {idStatusText && <div className={idStatusClass}>{idStatusText}</div>}

            {/* 가입 버튼 눌렀을 때(실패 시) 빨간 안내 */}
            {submitErrors.loginId && (
              <div className="field-message bad">{submitErrors.loginId}</div>
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
              ref={passwordRef}
              type="password"
              className="signup-input"
              placeholder="영문/숫자/특수문자 8~15자"
              value={form.password}
              onChange={handleChange("password")}
            />
            {submitErrors.password && (
              <div className="field-message bad">{submitErrors.password}</div>
            )}
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
              ref={passwordCheckRef}
              type="password"
              className="signup-input"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordCheck}
              onChange={handleChange("passwordCheck")}
            />
            {submitErrors.passwordCheck && (
              <div className="field-message bad">
                {submitErrors.passwordCheck}
              </div>
            )}
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
              ref={nameRef}
              type="text"
              className="signup-input"
              placeholder="성함을 입력하세요"
              value={form.name}
              onChange={handleChange("name")}
            />
            {submitErrors.name && (
              <div className="field-message bad">{submitErrors.name}</div>
            )}
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
              ref={phoneRef}
              type="tel"
              className="signup-input"
              placeholder="010-0000-0000"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
            {submitErrors.phoneNumber && (
              <div className="field-message bad">{submitErrors.phoneNumber}</div>
            )}
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
                ref={emailRef}
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
                ref={emailSendBtnRef}
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

            {submitErrors.email && !(emailFieldIsError && emailFieldMessage) && (
              <div className="field-message bad email-field-msg">
                {submitErrors.email}
              </div>
            )}
          </div>

          {/* OTP 섹션 */}
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
                  firstRef={otpFirstRef}
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

              {submitErrors.otp && (
                <div
                  className="field-message bad"
                  style={{ marginLeft: 0, marginTop: "8px" }}
                >
                  {submitErrors.otp}
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
                    checked={form.gender === "MALE"}
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
                    checked={form.gender === "FEMALE"}
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

          <button
            className="signup-button"
            onClick={handleSignupComplete}
            disabled={signupLoading}
          >
            {signupLoading ? "처리중..." : "회원가입 신청"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;