import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css";

const FindIdResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = location.state?.name || '회원';
  const foundId = location.state?.foundId || '';
  const createdAt = location.state?.createdAt || '';

  return (
    <AuthLayout
      title="아이디 찾기 결과"
      description="입력하신 정보와 일치하는 아이디입니다."
    >
      <div className="tab-content fade-in">

        <div className="success-icon-area" style={{ marginTop: '10px', marginBottom: '30px', height: 'auto' }}>
          <svg
            className="success-icon-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: '60px', height: '60px' }}
          >
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="approval-box" style={{ padding: '30px 20px', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '15px' }}>
            <strong>{userName}</strong> 님의 아이디는
          </p>

          <h3 style={{
            margin: '0',
            color: 'var(--primary-green)',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            {foundId || "(아이디 없음)"}
          </h3>

          {createdAt && (
            <p style={{ margin: '10px 0 0 0', color: '#888', fontSize: '13px' }}>
              가입일: {createdAt}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary btn-full-width"
            onClick={() => navigate('/login')}
          >
            로그인하기
          </button>

          <button
            className="btn-primary btn-full-width"
            onClick={() => navigate('/find-id', { state: { initialTab: 'pw' } })}
            style={{
              backgroundColor: '#999',
              borderColor: '#999'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#777'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#999'}
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="login-bottom-links" style={{ marginTop: '25px' }}>
          <button className="link-btn" onClick={() => navigate('/signup')}>회원가입</button>
          <div className="link-divider"></div>
          <button className="link-btn" onClick={() => navigate('/login')}>로그인</button>
        </div>

      </div>
    </AuthLayout>
  );
};

export default FindIdResultPage;
