import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css";
import { findPassword, verifyCode } from "../../api/authAPI";

function formatMMSS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const loginId = sessionStorage.getItem("fp_loginId") || "";
  const email = sessionStorage.getItem("fp_email") || "";
  const expiresAt = Number(sessionStorage.getItem("fp_expiresAt") || "0");
  const name = sessionStorage.getItem("fp_name") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  
  const remainingMs = useMemo(() => expiresAt - now, [expiresAt, now]);
  const isExpired = remainingMs <= 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!loginId || !email) {
      navigate("/find-id", { state: { initialTab: "pw" } });
    }
  }, [loginId, email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (code.length !== 6) {
      setErrorMsg("6자리 인증번호를 모두 입력해주세요.");
      return;
    }

    if (isExpired) {
      setErrorMsg("인증번호가 만료되었습니다. 재발송해주세요.");
      return;
    }

    try {
      setLoading(true);
      await verifyCode({ loginId, code });
      sessionStorage.setItem("fp_code", code);
      navigate("/find-password/result", { state: { uid: loginId } });
    } catch (err) {
      const msg = err?.response?.data?.message || "인증번호가 올바르지 않습니다.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setCode("");
    if (inputRef.current) inputRef.current.focus();

    try {
      setResending(true);
      await findPassword({ name, loginId, email });
      sessionStorage.setItem("fp_expiresAt", String(Date.now() + 5 * 60 * 1000));
    } catch (err) {
      const msg = err?.response?.data?.message || "재발송 실패. 잠시 후 다시 시도해주세요.";
      setErrorMsg(msg);
    } finally {
      setResending(false);
    }
  };

  // 이메일 마스킹 처리 (ex: ab***@gmail.com)
  const maskedEmail = useMemo(() => {
     if (!email) return "";
     const [local, domain] = email.split("@");
     if (!local || !domain) return email;
     const visible = local.slice(0, 2);
     return `${visible}***@${domain}`;
  }, [email]);

  return (
    <AuthLayout title="" description=""> 
      
      <div className="fade-in verify-container">
        <div className="verify-header">
            <h2>인증번호 입력</h2>
            <p>
                <span className="email-highlight">{maskedEmail}</span>으로 보내드린<br/>
                인증번호 6자리를 입력해주세요.
            </p>
        </div>

        <form onSubmit={handleVerify} className="verify-form">
 
          <div className="otp-area" onClick={() => inputRef.current.focus()}>
            
            <input
              ref={inputRef}
              className="otp-hidden-input"
              value={code}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(val);
              }}
            />

            <div className="otp-visual-boxes">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx} 
                  className={`otp-box ${code.length === idx ? 'active' : ''} ${code[idx] ? 'filled' : ''} ${errorMsg ? 'error' : ''}`}
                >
                  {code[idx]}
                </div>
              ))}
            </div>
            
          </div>

          <div className="timer-area">
             <span className={`timer-text ${remainingMs < 60000 ? 'urgent' : ''}`}>
               {isExpired ? "시간 만료" : formatMMSS(remainingMs)}
             </span>
          </div>

          {errorMsg && <p className="error-message-centered">{errorMsg}</p>}

          <button 
            className="btn-primary btn-full-width mt-large" 
            disabled={loading || code.length < 6}
          >
            {loading ? "확인 중..." : "인증하기"}
          </button>
        </form>

        <div className="resend-section">
          <p>인증번호가 오지 않나요?</p>
          <button 
            onClick={handleResend} 
            disabled={resending}
            className="btn-text-link"
          >
            {resending ? "발송 중..." : "인증번호 재발송"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyCodePage;