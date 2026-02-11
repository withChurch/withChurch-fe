import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css"; 

const FindIdPage = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [activeTab, setActiveTab] = useState(
    location.state?.initialTab === 'pw' ? 'pw' : 'id'
  );

  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);


  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    uid: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFindId = () => {
    if (!formData.name.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('휴대폰 번호를 입력해 주세요.');
      return;
    }
    navigate('/find-id/result', { state: { name: formData.name } });
  };

  const handleFindPw = () => {
    if (!formData.uid.trim()) {
      alert('아이디를 입력해 주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('휴대폰 번호를 입력해 주세요.');
      return;
    }
    navigate('/find-password/result', { state: { uid: formData.uid } });
  };

  return (
    <AuthLayout title={null} description={null}>
      <div className="find-tab-group">
        <button
          className={`find-tab-btn ${activeTab === 'id' ? 'active' : ''}`}
          onClick={() => setActiveTab('id')}
        >
          아이디 찾기
        </button>
        <button
          className={`find-tab-btn ${activeTab === 'pw' ? 'active' : ''}`}
          onClick={() => setActiveTab('pw')}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="find-form-container">
        {activeTab === 'id' ? (
          <div className="tab-content fade-in">
            <p className="tab-description">
              가입 시 등록한 이름과 휴대폰 번호를 입력해 주세요.
            </p>
            <div className="login-input-group">
              <input
                type="text"
                name="name"
                className="auth-input"
                placeholder="이름"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="login-input-group">
              <input
                type="text"
                name="phone"
                className="auth-input"
                placeholder="휴대폰 번호 (- 없이 입력)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button 
              className="btn-primary btn-full-width" 
              style={{ marginTop: '10px' }}
              onClick={handleFindId}
            >
              아이디 찾기
            </button>
          </div>
        ) : (
          <div className="tab-content fade-in">
            <p className="tab-description">
              가입한 아이디와 휴대폰 번호를 입력해 주세요.
            </p>
            <div className="login-input-group">
              <input
                type="text"
                name="uid"
                className="auth-input"
                placeholder="아이디"
                value={formData.uid}
                onChange={handleChange}
              />
            </div>
            <div className="login-input-group">
              <input
                type="text"
                name="phone"
                className="auth-input"
                placeholder="휴대폰 번호 (- 없이 입력)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button 
              className="btn-primary btn-full-width" 
              style={{ marginTop: '10px' }}
              onClick={handleFindPw}
            >
              비밀번호 재설정
            </button>
          </div>
        )}
      </div>

      <div className="login-bottom-links">
        <button className="link-btn" onClick={() => navigate('/login')}>로그인</button>
        <div className="link-divider"></div>
        <button className="link-btn" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </AuthLayout>
  );
};

export default FindIdPage;