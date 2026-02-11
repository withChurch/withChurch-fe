import "./GreetingPage.css";
import pastorImg from "../../assets/roundpastor.png";

import { BsChatFill } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import {Home} from "lucide-react";

function PastorPage(){
  return(
    <div className="pastor-page">
      <div className="intro-breadcrumb">
        <Home 
          size={15}
          style={{verticalAlign: "middle", marginRight: 6, marginBottom: 2}}
        />
        <span>{"◦ 교회소개 > 담임목사 소개"}</span>
      </div>

      <section className="page1">
        <div className="title-wrapper">
          <p className="title">담임목사 소개</p>
          <div className="divi-line"></div>
        </div>
      </section>

      {/*담임목사 프로필*/}
      <section className="ptr-profile">
        <div className="ptr-card">
          <img src={pastorImg} alt="pastor-image" className="ptr-img" />

          <p className="ptr-name">홍길동 담임목사</p>

          <p className="ptr-word">
            "함께 신앙 생활하며, 서로를 격려하고 함께 가는
            <br />
            WithChurch가 있어 행복합니다."
          </p>

          <div className="ptr-sns">
            <button className="ptr-sns-btn" aria-label="kakaotalk">
              <BsChatFill size={20} />
            </button>
            <button className="ptr-sns-btn is-insta" aria-label="instagram">
              <AiFillInstagram size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="ptr-mid-title">
        <div className="ptr-start">
          <p className="ptr-start-title">약력</p>
          <div className="ptr-bottom-line" />
        </div>
      </section>

      <section className="ptr-histo">
        <div className="ptr-histo-inner">
          <ul className="ptr-list-career">
            <li>19nn년 000교회에서 주님 영접 및 세례</li>
            <li>2nnn년 OOO교회에서 목사안수</li>
            <li>인도 바라나시 해외 선교사 n년 사역</li>
            <li>해외선교회 본부에서 n년 사역</li>
            <li>OOO교회에서 어린이와 선교목사로 사역</li>
            <li>2nnn년 n월 WithChurch 교회 개척</li>
          </ul>

          <ul className="ptr-list-edu">
            <li>OOO 고등학교 졸업</li>
            <li>한국외국어대학교 대학원 OOOO학과 졸업</li>
          </ul>
        </div>
      </section>

      <section className="ptr-mid-title">
        <div className="ptr-start">
          <p className="ptr-start-title">목회철학</p>
          <div className="ptr-bottom-line" />
        </div>
      </section>

      {/* 목회철학 */}
      <section className="ptr-pri">
        <div className="ptr-pri-inner">
          <div className="ptr-grid">
            <div className="ptr-box">
              <p className="ptr-head">첫째, 다음세대에 신앙을 계승하는 교회로 쓰임받기를 기도합니다.</p>
              <p className="ptr-text">
                말씀은 세대를 넘어 전해져야 합니다.
                <br />
                지식에 머무는 신앙이 아니라 삶을 변화시키는 말씀으로, 어린이와 청소년, 청년에 이르기까지 복음의 뿌리가 깊이
                <br />
                내리도록 양육하는 교회를 지향합니다. 미래 교회와 사회를 섬길 그리스도의 제자들이 이땅에서 준비되기를 기도합니다.
              </p>
            </div>

            <div className="ptr-box">
              <p className="ptr-head">둘째, 복음적 평화통일에 쓰임받는 교회가 되기를 기도합니다.</p>
              <p className="ptr-text">
                우리는 교회 안의 제자훈련을 넘어, 눈물의 기도로 민족을 품는 공동체가 되기를 원합니다.
                <br />
                제자훈련과 사회적 섬김을 통해, 분단의 아픔을 기억하며 복음 안에서 통일의 미래를 준비하는 영적 등대로 쓰임받기를 기도합니다.
              </p>
            </div>

            <div className="ptr-box">
              <p className="ptr-head">셋째, 세계선교의 마무리에 함께 쓰임받는 교회가 되기를 기도합니다.</p>
              <p className="ptr-text">
                우리는 전방향 네트워킹 시대의 글로벌 플랫폼 교회로 부름받았다고 믿습니다.
                <br />
                로컬 제자훈련을 통해 제자훈련의 국제화를 이루어 세계 교회를 섬기고자 합니다. 
                <br />
                한국 교회와 함께 은혜의 군단을 이루어 열방을 섬기는 사명에 쓰임받기를 기도합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PastorPage;