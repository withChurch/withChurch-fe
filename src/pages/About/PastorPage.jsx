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

      <section className="ptr-goal">
        <div className="ptr-top-line" />
      </section>
    </div>
  )
}

export default PastorPage;