import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyInfo } from "../../api/userAPI";
import styled from "styled-components";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const initialFormRef = useRef(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const data = res.data.data;
        const mappedForm = {
          name: data.name || "",
          loginId: data.loginId || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          gender: data.gender || "MALE",
          birthAt: data.birthAt || "",
        };
        setForm(mappedForm);
        initialFormRef.current = mappedForm;
      })
      .catch((err) => console.error("프로필 조회 실패", err))
      .finally(() => setLoading(false));
  }, []);

  const LoadingWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFCF8;
  `;

  const LoadingText = styled.p`
    font-size: 15px;
    color: #8C6E5A;
    font-weight: 500;
    &::after {
      content: "";
      animation: dots 1.5s infinite;
    }
    @keyframes dots {
      0% { content: ""; }
      33% { content: "."; }
      66% { content: ".."; }
      100% { content: "..."; }
    }
  `;

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingText>불러오는 중</LoadingText>
      </LoadingWrapper>
    );
  }

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialFormRef.current);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "이름을 입력해 주세요.";
    if (!/^010-\d{4}-\d{4}$/.test(form.phoneNumber))
      err.phoneNumber = "전화번호 형식이 올바르지 않습니다.";
    if (!form.birthAt) err.birthAt = "생년월일을 선택해 주세요.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await updateMyInfo({
        name: form.name,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        birthAt: form.birthAt,
      });
      alert("프로필이 수정되었습니다.");
      navigate("/profile");
    } catch (e) {
      alert("프로필 수정에 실패했습니다.");
    }
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
        background: "#FFFCF8",
        minHeight: "100vh",
        padding: "100px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        .profile-input::placeholder {
          color: #BDB5AD !important;
        }

        .gender-toggle {
          display: flex;
          gap: 10px;
        }

        .gender-chip {
          flex: 1;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E1D0BC; 
          border-radius: 8px;
          cursor: pointer;
          font-size: 14.5px;
          color: #8C6E5A; 
          background: #FFFFFF;
          transition: all 0.2s ease;
          user-select: none;
        }

        .gender-chip input {
          display: none;
        }

        .gender-chip:hover {
          background: #FAF3EA;
        }

        .gender-chip.selected {
          border-color: #8C6E5A; 
          background: #F4EADF;
          color: #4A3A31;
          font-weight: 600;
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
          프로필 수정
        </div>

        <div
          style={{
            border: "1px solid #F0E6DA",
            borderRadius: 12,
            padding: "35px 30px 40px",
            background: "white",
            boxShadow: "0 4px 16px rgba(107, 78, 61, 0.04)",
            boxSizing: "border-box",
          }}
        >
          <InputBlock label="이름" name="name" value={form.name} onChange={handleChange} error={errors.name} />
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

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14.5, color: "#6B4E3D", marginBottom: 8, fontWeight: 500 }}>성별</div>
            <div className="gender-toggle">
              <label className={`gender-chip ${form.gender === "MALE" ? "selected" : ""}`}>
                <input type="radio" name="gender" value="MALE" checked={form.gender === "MALE"} onChange={handleChange} />
                남성
              </label>
              <label className={`gender-chip ${form.gender === "FEMALE" ? "selected" : ""}`}>
                <input type="radio" name="gender" value="FEMALE" checked={form.gender === "FEMALE"} onChange={handleChange} />
                여성
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 35 }}>
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
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBlock({ label, name, value, onChange, readOnly, type = "text", placeholder, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 14.5, color: "#6B4E3D", marginBottom: 8, fontWeight: 500 }}>{label}</div>
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
          padding: "12px 14px",
          borderRadius: 8,
          border: "1px solid #E1D0BC",
          fontSize: 14.5,
          color: readOnly ? "#8C837C" : "#4A3A31",
          background: readOnly ? "#FAF8F5" : "white",
          outline: "none",
          transition: "0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          if (!readOnly) {
            e.target.style.border = "1px solid #8C6E5A";
            e.target.style.boxShadow = "0 0 0 3px rgba(140, 110, 90, 0.1)";
          }
        }}
        onBlur={(e) => {
          if (!readOnly) {
            e.target.style.border = "1px solid #E1D0BC";
            e.target.style.boxShadow = "none";
          }
        }}
      />
      {error && <div style={{ marginTop: 6, fontSize: 13, color: "#D96C6C" }}>{error}</div>}
    </div>
  );
}