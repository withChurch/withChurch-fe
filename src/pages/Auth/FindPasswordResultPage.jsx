import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css";
import { resetPassword } from "../../api/authAPI";

const FindPassWordResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginId =
    location.state?.loginId ||
    location.state?.uid ||
    sessionStorage.getItem("fp_loginId") ||
    "";

  const code =
    location.state?.code ||
    sessionStorage.getItem("fp_code") ||
    "";

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFindPwSession = () => {
    ["fp_name", "fp_loginId", "fp_email", "fp_code", "fp_expiresAt"].forEach((k) =>
      sessionStorage.removeItem(k)
    );
  };

  useEffect(() => {
    if (!loginId) {
      setErrorMessage("아이디 정보가 없어요. 비밀번호 찾기를 다시 진행해주세요.");
      return;
    }
    if (!code) {
      setErrorMessage("인증이 완료되지 않았어요. 인증번호 확인 후 다시 시도해주세요.");
    }
  }, [loginId, code]);

  const handleResetPassword = async () => {
    if (loading) return;
    setErrorMessage('');

    if (!loginId) {
      setErrorMessage("아이디 정보가 없어요. 비밀번호 찾기를 다시 진행해주세요.");
      return;
    }
    if (!code) {
      setErrorMessage("인증이 완료되지 않았어요. 인증번호 확인부터 진행해주세요.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        loginId,
        code,
        newPassword,
        confirmPassword,
      });

      clearFindPwSession();
      alert('비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "비밀번호 변경에 실패했어요. 인증번호 만료/오류 여부를 확인해주세요.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    clearFindPwSession();
    navigate('/find-id', { state: { initialTab: 'pw' } });
  };

  return (
    <AuthLayout
      title="비밀번호 재설정"
      description="새로운 비밀번호를 입력해 주세요."
    >
      <div className="tab-content fade-in">

        {loginId && (
          <div className="find-pw-info">
            <strong>{loginId}</strong> 님의<br />
            새로운 비밀번호를 설정합니다.
          </div>
        )}

        <div className="login-input-group">
          <input
            type="password"
            className="auth-input"
            placeholder="새 비밀번호 (8자 이상)"
            value={newPassword}
            disabled={loading}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        <div className="login-input-group">
          <input
            type="password"
            className="auth-input"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            disabled={loading}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {errorMessage && (
          <div className="error-text">
            * {errorMessage}
          </div>
        )}

        <button
          className="btn-primary btn-full-width"
          style={{ marginTop: '10px' }}
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>

        {(!loginId || !code) && (
          <button
            className="btn-primary btn-full-width"
            style={{ marginTop: '10px', backgroundColor: '#999', borderColor: '#999' }}
            onClick={handleRestart}
            disabled={loading}
          >
            비밀번호 찾기 다시하기
          </button>
        )}

        <div className="login-bottom-links">
          <button className="link-btn" onClick={() => navigate('/login')}>로그인</button>
          <div className="link-divider"></div>
          <button className="link-btn" onClick={() => navigate('/signup')}>회원가입</button>
        </div>

      </div>
    </AuthLayout>
  );
};

export default FindPassWordResultPage;
