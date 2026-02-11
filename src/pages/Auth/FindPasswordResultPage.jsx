import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css"; 

const FindPassWordResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.uid || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = () => {
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
    
    alert('비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.');
    navigate('/login');
  };

  return (
    <AuthLayout 
      title="비밀번호 재설정" 
      description="새로운 비밀번호를 입력해 주세요."
    >
      <div className="tab-content fade-in">
        
        {userId && (
          <div className="find-pw-info">
            <strong>{userId}</strong> 님의<br />
            새로운 비밀번호를 설정합니다.
          </div>
        )}

        <div className="login-input-group">
          <input
            type="password"
            className="auth-input"
            placeholder="새 비밀번호 (8자 이상)"
            value={newPassword}
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
        >
          비밀번호 변경
        </button>

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