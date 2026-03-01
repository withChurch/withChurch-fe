import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/userAPI";

export default function PasswordChangePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let err = {};

    if (!form.currentPw.trim()) {
      err.currentPw = "현재 비밀번호를 입력해 주세요.";
    }

    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!pwRule.test(form.newPw)) {
      err.newPw = "비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.";
    }

    if (form.newPw !== form.confirmPw) {
      err.confirmPw = "새 비밀번호가 일치하지 않습니다.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await changePassword({
        currentPassword: form.currentPw,
        newPassword: form.newPw,
        confirmPassword: form.confirmPw,
      });

      alert("비밀번호가 변경되었습니다.");
      navigate("/profile");
    } catch (err) {
      const status = err.response?.status;

      if (status === 400 || status === 401 || status === 500) {
        setErrors((prev) => ({
          ...prev,
          currentPw: "현재 비밀번호가 올바르지 않습니다.",
        }));
        return;
      }

      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div
      style={{
        background: "#FFFCF8",
        minHeight: "100vh",
        padding: "100px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        .pw-input::placeholder {
          color: #BDB5AD !important;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 450 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: "600",
            marginBottom: 25,
            color: "#4A3A31",
            padding: "0 5px",
            letterSpacing: "-0.5px",
          }}
        >
          비밀번호 변경
        </div>

        <div
          style={{
            border: "1px solid #F0E6DA",
            borderRadius: 12,
            padding: "35px 30px 40px",
            background: "white",
            boxShadow: "0 4px 16px rgba(107, 78, 61, 0.04)", // 부드러운 그림자
          }}
        >
          <InputField
            label="현재 비밀번호"
            name="currentPw"
            type="password"
            value={form.currentPw}
            onChange={handleChange}
            error={errors.currentPw}
            showForgotLink={true}
            navigate={navigate}
          />

          <InputField
            label="새 비밀번호"
            name="newPw"
            type="password"
            value={form.newPw}
            onChange={handleChange}
            error={errors.newPw}
          />

          <InputField
            label="새 비밀번호 확인"
            name="confirmPw"
            type="password"
            value={form.confirmPw}
            onChange={handleChange}
            error={errors.confirmPw}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 35,
            }}
          >
            {/* 취소 버튼: 밝은 베이지 */}
            <button
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                fontSize: 14.5,
                fontWeight: 500,
                background: "#FFFCF8",
                border: "1px solid #E1D0BC",
                color: "#6B4E3D",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4EADF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFCF8")}
              onClick={handleCancel}
            >
              취소
            </button>

             <button
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                fontSize: 14.5,
                fontWeight: 500,
                color: "white",
                background: "#276026",
                border: "none",
                cursor: "pointer",
                transition: "0.2s",
                boxShadow: "0 4px 10px rgba(39, 96, 38, 0.2)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1E4D1D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#276026")}
              onClick={handleSave}
            >
              변경하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type, value, onChange, error, showForgotLink, navigate }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 14.5, color: "#6B4E3D", marginBottom: 8, fontWeight: 500 }}>
        {label}
      </div>

      <input
        className="pw-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 8,
          border: "1px solid #E1D0BC",
          fontSize: 14.5,
          color: "#4A3A31",
          background: "white",
          outline: "none",
          transition: "0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid #8C6E5A";
          e.target.style.boxShadow = "0 0 0 3px rgba(140, 110, 90, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid #E1D0BC";
          e.target.style.boxShadow = "none";
        }}
      />

      {error && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#D96C6C" }}>
          {error}
          {showForgotLink && (
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  color: "#8C6E5A",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
                onClick={() => navigate("/find-id")}
              >
                비밀번호를 잊으셨나요?
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}