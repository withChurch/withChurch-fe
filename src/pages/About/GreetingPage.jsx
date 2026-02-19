import "./GreetingPage.css";
import churchImg from "../../assets/churchout.png";

import { FaPeopleRoof, FaHandsPraying, FaHeart, FaBookBible } from "react-icons/fa6";
import { IoMail, IoCall } from "react-icons/io5";
import {Home} from "lucide-react";

function GreetingPage(){
  return(
    <div className="greeting-page">
      
      <div className="intro-breadcrumb">
        <Home 
          size={15}
          style={{verticalAlign: "middle", marginRight: 6, marginBottom: 2}}
        />
        <span>{"> 교회소개 > 인사말"}</span>
      </div>

      <section className="page1">
        <div className="title-wrapper">
          <p className="title">인사말</p>
          <div className="divi-line"></div>
        </div>
      </section>
      
      {/*교회인사말*/}
      <section className="intro">
        <div className="content1">
          <p className="head-text">
            WithChurch에 오신 것을 환영합니다
          </p>
          <p className="quote-text">
            WithChurch는 신앙교회의 온전한 회복을 소망하며 개척된 교회입니다.
            <br />
            여러분의 삶과 가정 속에 예수 그리스도의 사랑과 은혜가 충만하시기를 기원합니다.
          </p>
        </div>
      </section>

      <section className="img-section">
        <img src={churchImg} alt="church banner" className="church-img"></img>
      </section>

      {/*교회 대표 말씀*/}
      <section className="quote">
        <div className="quote-inner">
          <div className="content2">
            <p className="main-quote">
              "날마다 마음을 같이하여 성전에 모이기를 힘쓰고 집에서 떡을 떼며 기쁨과 순전한 마음으로
              <br />
              음식을 먹고 하나님을 찬미하며 또 온 백성에게 칭송을 받으니
              <br />
              주께서 구원 받는 사람을 날마다 더하게 하시니라"
              <br />
              -사도행전 2장 46-47절-
            </p>
          </div>
        </div>
      </section>

      {/* 교회신념 */}
      <section className="church-pri">
        <div className="church-pri-inner">
          <div className="pri-grid">
            <div className="pri-box">
              <FaBookBible className="pri-icon" />
              <p className="pri-head">성경적 설교</p>
              <p className="pri-text">
                성경 본문을 따라 말씀을 전하며,
                <br />
                하나님의 말씀을 이해하고
                <br />
                삶에 적용하도록 돕습니다.
              </p>
            </div>

            <div className="pri-box">
              <FaPeopleRoof className="pri-icon" />
              <p className="pri-head">나눔과 섬김의 공동체</p>
              <p className="pri-text">
                하나님의 사랑을 받은 공동체로서,
                <br />
                성령 안에서 서로 연결되고
                <br />
                나누며 섬기는 관계를 세웁니다.
              </p>
            </div>

            <div className="pri-box">
              <FaHandsPraying className="pri-icon" />
              <p className="pri-head">건강한 가정</p>
              <p className="pri-text">
                은혜와 사랑이 가정 안에서부터 흘러가도록,
                <br />
                가정이 믿음과 제자훈련의
                <br />
                첫 번째 자리가 되도록 함께합니다.
              </p>
            </div>

            <div className="pri-box">
              <FaHeart className="pri-icon" />
              <p className="pri-head">리더 양성</p>
              <p className="pri-text">
                성령의 인도하심 안에서,
                <br />
                섬김으로 이끌고 다음 세대를
                <br />
                세우는 영적 리더를 양성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="church-contact">
        <div className="cont-inner">
          <div className="cont-grid">
            <div className="contact-box">
              <IoMail className="contact-icon" />
                <p className="contact-info">이메일: withchurch1234@gmail.com</p>
            </div>

            <div className="contact-box">
              <IoCall className="contact-icon" />
              <p className="contact-info">전화번호: 02-597-0691</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default GreetingPage;