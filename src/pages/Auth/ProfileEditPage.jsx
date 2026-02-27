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
      .catch((err) => {
        console.error("프로필 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const LoadingWrapper = styled.div`
    width: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const LoadingText = styled.p`
    font-size: 14px;
    color: #999;

    &::after {
      content: "";
      animation: dots 1.5s infinite;
    }

    @keyframes dots {
      0% {
        content: "";
      }
      33% {
        content: ".";
      }
      66% {
        content: "..";
      }
      100% {
        content: "...";
      }
    }
  `;

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingText>로딩중...</LoadingText>
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

  // 저장 (PATCH)
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
        padding: "0 20px",
      }}
    >
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

          /* ✅ 성별: 라디오 동그라미 제거 -> 칩/버튼 형태 */
          .gender-toggle {
            display: flex;
            gap: 10px;
          }

          .gender-chip {
            flex: 1;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(225, 208, 188, 0.95); /* #E1D0BC */
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            color: #6B4E3D; /* 갈색 포인트 */
            background: #FFFFFF;
            transition: all 0.15s ease;
            user-select: none;
          }

          .gender-chip input {
            display: none;
          }

          .gender-chip:hover {
            background: #FAF3EA;
            border-color: rgba(107, 78, 61, 0.25);
          }

          .gender-chip.selected {
            border-color: #276026; /* 초록 포인트 */
            background: #F0F7F0;
            color: #276026;
            font-weight: 600;
            box-shadow: 0 6px 14px rgba(39, 96, 38, 0.10);
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
            color: "#2b2b2b",
          }}
        >
          프로필 수정
        </div>

        <div
          style={{
            border: "1px solid rgba(225, 208, 188, 0.9)", // 베이지 테두리
            borderRadius: 12,
            padding: "32px 35px 40px ",
            background: "white",
            boxShadow: "0 10px 30px rgba(107, 78, 61, 0.06)", // 살짝 브라운 톤 그림자
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
            <div style={{ fontSize: 15, marginBottom: 7.3, fontWeight: 500 }}>
              성별
            </div>

            {/* ✅ 라디오 원형 UI 제거: 칩 형태 */}
            <div className="gender-toggle">
              <label className={`gender-chip ${form.gender === "MALE" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={form.gender === "MALE"}
                  onChange={handleChange}
                />
                남
              </label>

              <label className={`gender-chip ${form.gender === "FEMALE" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={form.gender === "FEMALE"}
                  onChange={handleChange}
                />
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
                background: "#FFFCF8",
                border: "1px solid #E1D0BC",
                color: "#6B4E3D",
                cursor: "pointer",
                transition: "0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4EADF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFCF8")}
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
                background: "#276026",
                border: "none",
                cursor: "pointer",
                transition: "0.15s",
                boxShadow: "0 10px 18px rgba(39, 96, 38, 0.15)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e4d1d")}
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
          borderRadius: 8,
          border: "1px solid rgba(225, 208, 188, 0.95)", // 베이지 테두리
          fontSize: 14.5,
          background: readOnly ? "#F9F6F3" : "white",
          outline: "none",
          transition: "0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid #276026";
          e.target.style.boxShadow = "0 0 0 3px rgba(39, 96, 38, 0.06)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(225, 208, 188, 0.95)";
          e.target.style.boxShadow = "none";
        }}
      />

      {error && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#d9534f" }}>{error}</div>
      )}
    </div>
  );
}