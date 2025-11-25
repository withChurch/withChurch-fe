import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      /*
      await axios.patch("/api/users/me/password", {
        currentPassword: form.currentPw,
        newPassword: form.newPw,
        confirmPassword: form.confirmPw,
      });
      */

      alert("비밀번호가 변경되었습니다.");
      navigate("/profile");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg?.includes("현재 비밀번호")) {
        setErrors((prev) => ({
          ...prev,
          currentPw: "현재 비밀번호가 올바르지 않습니다.",
        }));
      } else {
        alert("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "170px auto",
        padding: "0 20px",
      }}
    >
      <style>{`
        .pw-input::placeholder {
          color: #999 !important;
        }
      `}</style>

      <div
        style={{
          fontSize: 26,
          fontWeight: "500",
          marginBottom: 25,
          opacity: 0.9,
          padding: "0 5px",
          letterSpacing: "-0.1px",
          textShadow: "0.05px 0 0 currentColor",
        }}
      >
        비밀번호 변경
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: "32px 35px 40px",
          background: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
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
            gap: 11,
            marginTop: 35,
          }}
        >
          <button
            style={{
              padding: "9.5px 20px",
              borderRadius: 6,
              fontSize: 15,
              background: "#f5f4f4ff",
              border: "1px solid #ccc",
              cursor: "pointer",
              transition: "0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e5e5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f4f4ff")} 
            onClick={handleCancel}
          >
            취소
          </button>

          <button
            style={{
              padding: "9.5px 20px",
              borderRadius: 6,
              fontSize: 15,
              color: "white",
              background: "#376db4",
              border: "none",
              cursor: "pointer",
              transition: "0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#183f82")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#376db4")} 
            onClick={handleSave}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  showForgotLink,
  navigate,
}) {
  return (
    <div style={{ marginBottom: 25 }}>
      <div style={{ fontSize: 15, marginBottom: 7, fontWeight: 500 }}>
        {label}
      </div>

      <input
        className="pw-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=""
        style={{
          width: "100%",
          padding: "11px 13px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14.5,
          background: "white",
          outline: "none",
          transition: "0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #1b4d9c")}
        onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
      />

      {error && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#1b4d9c" }}>
          {error}

          {showForgotLink && (
            <div style={{ marginTop: 5 }}>
              <span
                style={{
                  color: "#1b4d9c",
                  cursor: "pointer",
                  textDecoration: "underline",
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
