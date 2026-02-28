import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyInfo } from "../../api/userAPI";
import styled, { keyframes, css } from "styled-components";
import { Shield, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

/** ✅ 쉬머(반짝임) 느리게 + 늦게 시작 */
const SHIMMER_DURATION = "3.2s";        // 숫자 키우면 더 느려짐
const SHIMMER_START_DELAY_MS = 250;     // 로딩 시작 후 이 시간 지나야 반짝임 시작

const Page = styled.div`
  background: #fffcf8;
  min-height: 100vh;
  padding: 100px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 450px;
`;

const TitleText = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #4a3a31;
  padding: 0 5px;
  letter-spacing: -0.5px;
`;

const Card = styled.div`
  border: 1px solid #f0e6da;
  border-radius: 12px;
  padding: 35px 30px 40px;
  background: white;
  box-shadow: 0 4px 16px rgba(107, 78, 61, 0.04);
  box-sizing: border-box;
`;

const shimmer = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(240%); }
`;

const Skel = styled.div`
  position: relative;
  overflow: hidden;
  background: #f4eadf;
  border-radius: ${({ $radius }) => $radius || "8px"};
  width: ${({ $w }) => $w || "100%"};
  height: ${({ $h }) => $h || "16px"};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    height: 100%;
    width: 60%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.55),
      transparent
    );

    ${({ $animate }) =>
    $animate
      ? css`animation: ${shimmer} ${SHIMMER_DURATION} ease-in-out infinite;`
      : css`animation: none;`}  
    }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none !important;
    }
  }
`;

const StatusCard = styled(Card)`
  text-align: center;
  padding: 42px 30px;
`;

const StatusTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #333;
  margin-bottom: 10px;
`;

const StatusDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 22px;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const Btn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
`;

const PrimaryBtn = styled(Btn)`
  border: none;
  background: #276026;
  color: #fff;
`;

const SecondaryBtn = styled(Btn)`
  background: #fff;
  border: 1px solid #e1d0bc;
  color: #6b4e3d;
`;

function ProfileEditSkeleton({ animate }) {
  return (
    <Page aria-busy="true">
      <Inner>
        {/* 타이틀 자리 */}
        <div style={{ padding: "0 5px", marginBottom: 25 }}>
          <Skel $h="28px" $w="140px" $radius="12px" $animate={animate} />
        </div>

        <Card>
          {/* InputBlock 4개(이름/로그인ID/이메일/전화) */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <Skel $h="14px" $w="80px" $radius="8px" $animate={animate} style={{ marginBottom: 8 }} />
              <Skel $h="46px" $w="100%" $radius="8px" $animate={animate} />
            </div>
          ))}

          {/* 성별 */}
          <div style={{ marginBottom: 20 }}>
            <Skel $h="14px" $w="60px" $radius="8px" $animate={animate} style={{ marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <Skel $h="46px" $w="100%" $radius="8px" $animate={animate} />
              <Skel $h="46px" $w="100%" $radius="8px" $animate={animate} />
            </div>
          </div>

          {/* 생년월일 */}
          <div style={{ marginBottom: 20 }}>
            <Skel $h="14px" $w="80px" $radius="8px" $animate={animate} style={{ marginBottom: 8 }} />
            <Skel $h="46px" $w="100%" $radius="8px" $animate={animate} />
          </div>

          {/* 버튼 */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 35 }}>
            <Skel $h="40px" $w="90px" $radius="10px" $animate={animate} />
            <Skel $h="40px" $w="100px" $radius="10px" $animate={animate} />
          </div>
        </Card>
      </Inner>
    </Page>
  );
}

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const initialFormRef = useRef(null);

  // ✅ 쉬머(반짝임) 늦게 시작
  const [animateSkeleton, setAnimateSkeleton] = useState(false);

  // ✅ 에러 분기 (세션만료/일반오류)
  const [errorType, setErrorType] = useState(null); // null | "AUTH" | "GENERAL"
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setErrorType(null);
    setErrorMessage("");

    try {
      const res = await getMyProfile();
      const data = res.data.data;

      const birthRaw = data.birthAt || "";
      const mappedForm = {
        name: data.name || "",
        loginId: data.loginId || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "MALE",
        birthAt: birthRaw ? birthRaw.slice(0, 10) : "",
      };

      setForm(mappedForm);
      initialFormRef.current = mappedForm;
    } catch (err) {
      console.error("프로필 조회 실패", err);

      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "프로필을 불러오지 못했습니다.";

      if (status === 401 || status === 403) {
        setErrorType("AUTH");
        setErrorMessage("로그아웃되었습니다.\n다시 로그인해 주세요.");
      } else {
        setErrorType("GENERAL");
        setErrorMessage(msg);
      }

      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 로딩이 짧으면 반짝임 거의 안 보이게: 0.25초 후에만 애니메이션 시작
  useEffect(() => {
    let t;
    if (loading) {
      setAnimateSkeleton(false);
      t = setTimeout(() => setAnimateSkeleton(true), SHIMMER_START_DELAY_MS);
    } else {
      setAnimateSkeleton(false);
    }
    return () => clearTimeout(t);
  }, [loading]);

  if (loading) {
    return <ProfileEditSkeleton animate={animateSkeleton} />;
  }

  // ✅ 세션 만료(로그아웃) UI
  if (errorType === "AUTH") {
    return (
      <Page>
        <Inner>
          <TitleText>프로필 수정</TitleText>
          <StatusCard>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Shield size={34} color="#999" />
            </div>
            <StatusTitle>로그아웃되었습니다</StatusTitle>
            <StatusDesc>{errorMessage}</StatusDesc>
            <BtnRow>
              <SecondaryBtn onClick={() => navigate("/profile")}>돌아가기</SecondaryBtn>
              <PrimaryBtn
                onClick={() => {
                  try {
                    logout();
                  } catch (_) {}
                  navigate("/login"); // TODO: 로그인 라우트로 수정
                }}
              >
                다시 로그인
              </PrimaryBtn>
            </BtnRow>
          </StatusCard>
        </Inner>
      </Page>
    );
  }

  // ✅ 일반 오류 UI
  if (errorType === "GENERAL") {
    return (
      <Page>
        <Inner>
          <TitleText>프로필 수정</TitleText>
          <StatusCard>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <AlertCircle size={34} color="#999" />
            </div>
            <StatusTitle>프로필을 불러오지 못했습니다</StatusTitle>
            <StatusDesc>{errorMessage}</StatusDesc>
            <BtnRow>
              <SecondaryBtn onClick={() => navigate("/profile")}>돌아가기</SecondaryBtn>
              <PrimaryBtn onClick={fetchProfile}>다시 시도</PrimaryBtn>
            </BtnRow>
          </StatusCard>
        </Inner>
      </Page>
    );
  }

  // form이 없으면 안전하게 처리
  if (!form) {
    return (
      <Page>
        <Inner>
          <TitleText>프로필 수정</TitleText>
          <StatusCard>
            <StatusTitle>프로필 정보를 불러올 수 없습니다</StatusTitle>
            <StatusDesc>잠시 후 다시 시도해 주세요.</StatusDesc>
            <BtnRow>
              <SecondaryBtn onClick={() => navigate("/profile")}>돌아가기</SecondaryBtn>
              <PrimaryBtn onClick={fetchProfile}>다시 시도</PrimaryBtn>
            </BtnRow>
          </StatusCard>
        </Inner>
      </Page>
    );
  }

  const isDirty =
    initialFormRef.current
      ? JSON.stringify(form) !== JSON.stringify(initialFormRef.current)
      : false;

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
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        try {
          logout();
        } catch (_) {}
        navigate("/login"); // TODO: 로그인 라우트로 수정
        return;
      }
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
    <Page>
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

      <Inner>
        <TitleText>프로필 수정</TitleText>

        <Card>
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
            <div style={{ fontSize: 14.5, color: "#6B4E3D", marginBottom: 8, fontWeight: 500 }}>
              성별
            </div>
            <div className="gender-toggle">
              <label className={`gender-chip ${form.gender === "MALE" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={form.gender === "MALE"}
                  onChange={handleChange}
                />
                남성
              </label>
              <label className={`gender-chip ${form.gender === "FEMALE" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={form.gender === "FEMALE"}
                  onChange={handleChange}
                />
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
        </Card>
      </Inner>
    </Page>
  );
}

function InputBlock({ label, name, value, onChange, readOnly, type = "text", placeholder, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 14.5, color: "#6B4E3D", marginBottom: 8, fontWeight: 500 }}>
        {label}
      </div>
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