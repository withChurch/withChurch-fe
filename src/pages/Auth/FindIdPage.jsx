import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from "../../components/auth/AuthLayout";
import "../../components/auth/AuthForm.css";
import { findPassword, findId } from "../../api/authAPI";

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

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindId = async () => {
    if (loading) return;

    const name = formData.name.trim();
    const email = formData.phone.trim();

    if (!name) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!email) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      const res = await findId({ name, email });
      const data = res?.data;

      const payload = data?.data ?? data;

      let foundId = "";

      if (typeof payload === "string") {
        foundId = payload;
      } else if (Array.isArray(payload)) {
        foundId = payload.filter(Boolean).join(", ");
      } else {
        foundId =
          payload?.loginId ??
          payload?.foundId ??
          payload?.result?.loginId ??
          payload?.result?.foundId ??
          data?.loginId ??
          data?.foundId ??
          "";
      }

      if (!foundId) {
        alert("일치하는 계정을 찾지 못했습니다.");
        return;
      }

      sessionStorage.setItem("fi_name", name);
      sessionStorage.setItem("fi_email", email);
      sessionStorage.setItem("fi_foundId", foundId);

      navigate('/find-id/result', {
        state: { name, email, foundId }
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "아이디 찾기에 실패했습니다. 입력 정보를 확인해 주세요.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFindPw = async () => {
    if (loading) return;

    const name = formData.name.trim();
    const loginId = formData.uid.trim();
    const email = formData.phone.trim();

    if (!name) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!loginId) {
      alert('아이디를 입력해 주세요.');
      return;
    }
    if (!email) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      await findPassword({ name, loginId, email });

      sessionStorage.setItem("fp_name", name);
      sessionStorage.setItem("fp_loginId", loginId);
      sessionStorage.setItem("fp_email", email);
      sessionStorage.setItem("fp_expiresAt", String(Date.now() + 5 * 60 * 1000));
      sessionStorage.removeItem("fp_code");

      navigate('/verify-code');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "인증번호 발송에 실패했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={null} description={null}>
      <div className="find-tab-group">
        <button
          type="button"
          className={`find-tab-btn ${activeTab === 'id' ? 'active' : ''}`}
          onClick={() => setActiveTab('id')}
          disabled={loading}
        >
          아이디 찾기
        </button>
        <button
          type="button"
          className={`find-tab-btn ${activeTab === 'pw' ? 'active' : ''}`}
          onClick={() => setActiveTab('pw')}
          disabled={loading}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="find-form-container">
        {activeTab === 'id' ? (
          <div className="tab-content fade-in">
            <p className="tab-description">
              가입 시 등록한 이름과 이메일을 입력해 주세요.
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
                placeholder="이메일"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              className="btn-primary btn-full-width"
              style={{ marginTop: '10px' }}
              onClick={handleFindId}
              disabled={loading}
            >
              {loading ? "조회 중..." : "아이디 찾기"}
            </button>
          </div>
        ) : (
          <div className="tab-content fade-in">
            <p className="tab-description">
              가입한 이름, 아이디, 이메일을 입력해 주세요.
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
                placeholder="이메일"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="btn-primary btn-full-width"
              style={{ marginTop: '10px' }}
              onClick={handleFindPw}
              disabled={loading}
            >
              {loading ? "전송 중..." : "비밀번호 재설정"}
            </button>
          </div>
        )}
      </div>

      <div className="login-bottom-links">
        <button type="button" className="link-btn" onClick={() => navigate('/login')}>로그인</button>
        <div className="link-divider"></div>
        <button type="button" className="link-btn" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </AuthLayout>
  );
};

export default FindIdPage;
