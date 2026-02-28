import { useMemo } from "react";
import "./GreetingPage.css";
import Header from "../../components/common/Header";
import pastorFallback from "../../assets/roundpastor.png";

import { BsChatFill } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";

import { useChurchConfig } from "../../contexts/ChurchConfigContext";

const cleanText = (text = "") =>
  String(text)
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

const getLinkMeta = (type = "") => {
  const t = String(type).toLowerCase();

  if (t.includes("kakao")) {
    return { label: "kakaotalk", className: "ptr-sns-btn", Icon: BsChatFill };
  }
  if (t.includes("instagram") || t.includes("insta")) {
    return { label: "instagram", className: "ptr-sns-btn is-insta", Icon: AiFillInstagram };
  }

  return { label: type || "link", className: "ptr-sns-btn", Icon: BsChatFill };
};

function PastorSkeleton() {
  return (
    <>
      {/* 프로필 */}
      <section className="ptr-profile">
        <div className="ptr-card">
          <div className="skeleton" style={{ width: 120, height: 120, borderRadius: "999px" }} />
          <div className="skeleton" style={{ width: 180, height: 18, marginTop: 16 }} />
          <div className="skeleton" style={{ width: "min(92vw, 420px)", height: 14, marginTop: 12 }} />
          <div className="skeleton" style={{ width: "min(82vw, 360px)", height: 14, marginTop: 8 }} />

          <div className="ptr-sns" style={{ marginTop: 18 }}>
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: "999px" }} />
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: "999px" }} />
          </div>
        </div>
      </section>

      {/* 약력 타이틀 */}
      <section className="ptr-mid-title">
        <div className="ptr-start">
          <div className="skeleton" style={{ width: 120, height: 22 }} />
          <div className="ptr-bottom-line" />
        </div>
      </section>

      {/* 약력/학력 */}
      <section className="ptr-histo">
        <div className="ptr-histo-inner">
          <ul className="ptr-list-career">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}><div className="skeleton" style={{ width: "100%", height: 14 }} /></li>
            ))}
          </ul>
          <ul className="ptr-list-edu">
            {[1, 2].map((i) => (
              <li key={i}><div className="skeleton" style={{ width: "100%", height: 14 }} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* 목회철학 타이틀 */}
      <section className="ptr-mid-title">
        <div className="ptr-start">
          <div className="skeleton" style={{ width: 140, height: 22 }} />
          <div className="ptr-bottom-line" />
        </div>
      </section>

      {/* 목회철학 카드 */}
      <section className="ptr-pri">
        <div className="ptr-pri-inner">
          <div className="ptr-grid">
            {[1, 2, 3].map((i) => (
              <div className="ptr-box" key={i}>
                <div className="skeleton" style={{ width: "100%", height: 16, marginBottom: 12 }} />
                <div className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "90%", height: 14 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PastorPage(){
  const { config, loading } = useChurchConfig();
  const p = config?.pastorInfo;

  const pastorName = cleanText(p?.pastorName || "");
  const pastorIntro = cleanText(p?.pastorIntro || "");
  const pastorImgUrl = p?.pastorImg || "";

  const links = Array.isArray(p?.pastorLinks) ? p.pastorLinks : [];

  const careerItems = Array.isArray(p?.careerItems) ? p.careerItems : [];

  const { eduList, careerList } = useMemo(() => {
    const edu = [];
    const career = [];

    for (const item of careerItems) {
      const col = String(item?.column || "").trim();
      const text = cleanText(item?.text || "");
      if (!text) continue;

      if (col.includes("학력")) edu.push(text);
      else career.push(text);
    }

    return { eduList: edu, careerList: career };
  }, [careerItems]);

  const philo = Array.isArray(p?.ministryPhilo) ? p.ministryPhilo : [];

  const isProfileEmpty = !pastorName && !pastorIntro && !pastorImgUrl;

  const openLink = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pastor-page">
      <Header breadcrumb="> 교회소개 > 담임목사 소개" title="담임목사 소개" />

      {loading ? (
        <PastorSkeleton />
      ) : (
        <>
          {/* 담임목사 프로필 */}
          <section className="ptr-profile">
            <div className="ptr-card">
              <img
                src={pastorImgUrl || pastorFallback}
                alt="pastor-image"
                className="ptr-img"
                onError={(e) => {
                  e.currentTarget.src = pastorFallback;
                }}
              />

              {isProfileEmpty ? (
                <p className="ptr-name" style={{ marginTop: 16 }}>
                  담임목사 소개가 준비중입니다.
                </p>
              ) : (
                <>
                  <p className="ptr-name">{pastorName}</p>
                  <p className="ptr-word" style={{ whiteSpace: "pre-line" }}>
                    {pastorIntro}
                  </p>

                  {links.length > 0 && (
                    <div className="ptr-sns">
                      {links.map((l, idx) => {
                        const { label, className, Icon } = getLinkMeta(l.type);
                        return (
                          <button
                            key={`${label}-${idx}`}
                            className={className}
                            aria-label={label}
                            onClick={() => openLink(l.url)}
                            type="button"
                          >
                            <Icon size={20} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* 약력 */}
          <section className="ptr-mid-title">
            <div className="ptr-start">
              <p className="ptr-start-title">약력</p>
              <div className="ptr-bottom-line" />
            </div>
          </section>

          <section className="ptr-histo">
            <div className="ptr-histo-inner">
              <ul className="ptr-list-career">
                {careerList.length === 0 ? (
                  <li>약력이 준비중입니다.</li>
                ) : (
                  careerList.map((t, idx) => <li key={idx}>{t}</li>)
                )}
              </ul>

              <ul className="ptr-list-edu">
                {eduList.length === 0 ? (
                  <li>학력이 준비중입니다.</li>
                ) : (
                  eduList.map((t, idx) => <li key={idx}>{t}</li>)
                )}
              </ul>
            </div>
          </section>

          {/* 목회철학 */}
          <section className="ptr-mid-title">
            <div className="ptr-start">
              <p className="ptr-start-title">목회철학</p>
              <div className="ptr-bottom-line" />
            </div>
          </section>

          <section className="ptr-pri">
            <div className="ptr-pri-inner">
              <div className="ptr-grid">
                {philo.length === 0 ? (
                  <div className="ptr-box">
                    <p className="ptr-head">목회철학이 준비중입니다.</p>
                    <p className="ptr-text">잠시만 기다려 주세요.</p>
                  </div>
                ) : (
                  philo.map((x, idx) => (
                    <div className="ptr-box" key={`${idx}-${x.title}`}>
                      <p className="ptr-head">{cleanText(x.title)}</p>
                      <p className="ptr-text" style={{ whiteSpace: "pre-line" }}>
                        {cleanText(x.body)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default PastorPage;