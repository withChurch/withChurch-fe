import { useMemo } from "react";
import "./GreetingPage.css";
import Header from "../../components/common/Header";
import churchFallback from "../../assets/churchout.png";

import { FaPeopleRoof, FaHandsPraying, FaHeart, FaBookBible } from "react-icons/fa6";
import { IoMail, IoCall } from "react-icons/io5";

import { useChurchConfig } from "../../contexts/ChurchConfigContext";

const ICON_MAP = {
  icon1: FaBookBible,
  icon2: FaPeopleRoof,
  icon3: FaHandsPraying,
  icon4: FaHeart,
};

const cleanText = (text = "") =>
  String(text)
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

function GreetingSkeleton() {
  return (
    <>
      <section className="intro">
        <div className="content1">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      </section>

      <section className="img-section">
        <div className="skeleton skeleton-image" />
      </section>

      <section className="quote">
        <div className="quote-inner">
          <div className="content2">
            <div className="skeleton skeleton-verse" />
            <div className="skeleton skeleton-verse short" />
          </div>
        </div>
      </section>

      <section className="church-pri">
        <div className="church-pri-inner">
          <div className="pri-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="pri-box" key={i}>
                <div className="skeleton skeleton-icon" />
                <div className="skeleton skeleton-box-title" />
                <div className="skeleton skeleton-box-text" />
                <div className="skeleton skeleton-box-text short" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="church-contact">
        <div className="cont-inner">
          <div className="cont-grid">
            <div className="contact-box">
              <div className="skeleton skeleton-contact-icon" />
              <div className="skeleton skeleton-contact-text" />
            </div>

            <div className="contact-box">
              <div className="skeleton skeleton-contact-icon" />
              <div className="skeleton skeleton-contact-text" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GreetingPage(){
  const { config, loading } = useChurchConfig();
  const g = config?.greeting;

  const coreValues = useMemo(() => (g?.coreValues ? g.coreValues : []), [g]);

  //DB에 값이 없으면 기본 문구 대신 "준비중" 띄우기
  const greetTitle = g?.greetTitle;
  const greetQuote = cleanText(g?.greetQuote || "");
  const isGreetingEmpty = !greetTitle && !greetQuote;

  // 대표 말씀 없을 시 준비중 처리
  const greetVerse = cleanText(g?.greetVerse || "");
  const isVerseEmpty = !greetVerse;
  
  return(
    <div className="greeting-page">

      <Header breadcrumb="> 교회소개 > 인사말"  title="인사말"/>

      {loading ? (
        <GreetingSkeleton />
      ) : (
        <>
          {/*교회인사말*/}
          <section className="intro">
            <div className="content1">
              {isGreetingEmpty ? (
                <p className="head-text" style={{ textAlign: "center" }}>
                  인사말이 준비중입니다.
                </p>
              ) : (
                <>
                  <p className="head-text">{greetTitle}</p>
                  <p className="quote-text" style={{ whiteSpace: "pre-line" }}>
                    {greetQuote}
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="img-section">
            <img
              src={g?.churchImg || churchFallback}
              alt="church banner"
              className="church-img"
              onError={(e) => {
                e.currentTarget.src = churchFallback;
              }}
            />
          </section>

          {/* 교회 대표 말씀 */}
          <section className="quote">
            <div className="quote-inner">
              <div className="content2">
                {isVerseEmpty ? (
                  <p className="main-quote" style={{ textAlign: "center" }}>
                    대표 말씀이 준비중입니다.
                  </p>
                ) : (
                  <p className="main-quote" style={{ whiteSpace: "pre-line" }}>
                    {greetVerse}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 교회 신념*/}
          <section className="church-pri">
            <div className="church-pri-inner">
              <div className="pri-grid">
                {coreValues.length === 0 ? (
                  <div className="pri-box" style={{ textAlign: "center" }}>
                    <p className="pri-head">교회 신념이 준비중입니다.</p>
                    <p className="pri-text">잠시만 기다려 주세요.</p>
                  </div>
                ) : (
                  coreValues.map((item) => {
                    const Icon = ICON_MAP[item.icon] || FaHeart;
                    return (
                      <div className="pri-box" key={item.key || item.title}>
                        <Icon className="pri-icon" />
                        <p className="pri-head">{item.title}</p>
                        <p className="pri-text" style={{ whiteSpace: "pre-line" }}>
                          {cleanText(item.body)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* 연락처 */}
          <section className="church-contact">
            <div className="cont-inner">
              <div className="cont-grid">
                <div className="contact-box">
                  <IoMail className="contact-icon" />
                  <p className="contact-info">
                    이메일: {g?.churchMail ? g.churchMail : "준비중입니다."}
                  </p>
                </div>

                <div className="contact-box">
                  <IoCall className="contact-icon" />
                  <p className="contact-info">
                    전화번호: {g?.churchPhone ? g.churchPhone : "준비중입니다."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default GreetingPage;