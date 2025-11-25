import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const initialForm = {
    name: "홍길동",
    loginId: "hong123",
    email: "hong123@hufs.ac.kr",
    phoneNumber: "010-1234-5678",
    gender: "MALE",
    birthAt: "2006-01-01",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "이름을 입력해 주세요.";
    if (!form.phoneNumber.trim()) err.phoneNumber = "전화번호를 입력해 주세요.";
    if (!/^010-\d{4}-\d{4}$/.test(form.phoneNumber))
      err.phoneNumber = "전화번호 형식이 올바르지 않습니다. 예: 010-0000-0000";

    if (!form.birthAt) err.birthAt = "생년월일을 선택해 주세요.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    alert("프로필이 저장되었습니다. (여기서 API 연동)");
    navigate("/profile");
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("변경사항이 저장되지 않습니다. 취소하시겠습니까?")) {
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "167px auto",
        padding: "0 200px",
      }}
    >
      <style>{`
        .profile-input::placeholder {
          color: #999 !important;
        }

        .radio-wrapper {
          display: flex;
          align-items: center;
          gap: 25px;
          font-size: 14px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .radio-hidden {
          display: none;
        }

        .radio-custom {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid #999;
          margin-right: 6px;
          transition: 0.15s;
          box-sizing: border-box;
        }

        .radio-hidden:checked + .radio-custom {
          border-color: #1b4d9c;
          background: radial-gradient(circle, #1b4d9c 50%, transparent 50%);
        }

        .radio-label:hover .radio-custom {
          border-color: #1b4d9c;
        }
      `}</style>

      <div
        style={{
          fontSize: 26,
          fontWeight: "500",
          marginBottom: 25,
          opacity: 0.9,
          padding: "0 10px",
          letterSpacing: "-0.1px",
          textShadow: "0.05px 0 0 currentColor",
        }}
      >
        프로필 수정
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: "32px 35px 40px ",
          background: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
          boxSizing: "border-box",
        }}
      >
        <InputBlock
          label="이름"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <InputBlock label="로그인 ID" name="loginId" value={form.loginId} readOnly />

        <InputBlock label="이메일" name="email" value={form.email} readOnly />

        <InputBlock
          label="휴대폰 번호"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="예: 010-0000-0000"
          error={errors.phoneNumber}
        />

        <div style={{ marginBottom: 25 }}>
          <div style={{ fontSize: 15, marginBottom: 7.3, fontWeight: 500 }}>성별</div>

          <div className="radio-wrapper">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={form.gender === "MALE"}
                onChange={handleChange}
                className="radio-hidden"
              />
              <span className="radio-custom"></span>
              남
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={form.gender === "FEMALE"}
                onChange={handleChange}
                className="radio-hidden"
              />
              <span className="radio-custom"></span>
              여
            </label>
          </div>
        </div>

        <InputBlock
          label="생년월일"
          name="birthAt"
          type="date"
          value={form.birthAt}
          onChange={handleChange}
          error={errors.birthAt}
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
              padding: "10px 21px",
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
              padding: "10px 21px",
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
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBlock({
  label,
  name,
  value,
  onChange,
  readOnly,
  type = "text",
  placeholder,
  error,
}) {
  return (
    <div style={{ marginBottom: 25 }}>
      <div style={{ fontSize: 15, marginBottom: 7, fontWeight: 500 }}>{label}</div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="profile-input"
        style={{
          width: "100%",
          padding: "11px 13px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14.5,
          background: readOnly ? "#f5f5f5" : "white",
          outline: "none",
          transition: "0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #1b4d9c")}
        onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
      />

      {error && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#d9534f" }}>{error}</div>
      )}
    </div>
  );
}
