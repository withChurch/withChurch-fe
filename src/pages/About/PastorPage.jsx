import "./GreetingPage.css";
import pastorImage from "../../assets/pastor.png";
import wheatImage from "../../assets/wheatimg.png";

function PastorPage(){
  return(
    <div className="pastor-page">

      {/*회색바 영역*/}
      <section className="page1">
        <div className="container">
          <div className="title">담임목사 소개</div>
        </div>
      </section>

      {/*본문 영역*/}
      <section className="body2">
        <div className="body2-content">
          <div className="pastor-image-wrapper">
            <img src={pastorImage} alt="담임목사" className="pastor-image" />
          </div>
          <div className="body2-text">
            <p>19nn년 OOO교회에서 예수님을 주님으로 영접하고 침례를 받았습니다.</p>

            <p>nn년 연애 후 2nnn년 지금의 아내(OOO사모)와 결혼 하였습니다.<br></br>
            학교는 OOO고등학교와 한국외국어대학교 OOOOO학과 OOOO대학원을 졸업했으며,<br></br>
            2nnn년 OOO교회에서 목사안수를 받았습니다.</p>

            <p>목사 안수 후 기독교한국침례회 해외선교회(FMB) 선교사로<br></br>
            인도 바라나시와 해외선교회 본부에서 n년을 사역했습니다.<br></br>
            본부 사역 기간동안 OOOO교회에서 어린이와 선교목사로 사역을 하였습니다.</p>

            <p>2nnn년 n월 경기도 모현에서 With Church를 개척하였습니다.<br></br>
            OOOOO소속 OOOO목자로 섬기고 있습니다.</p>

            <p className="body-hight">함께 신앙 생활하며, 서로를 격려하고 함께 가는 With Church가 있어서 행복합니다.</p>
          </div>
          <div className="wheat-image-wrapper">
            <img src={wheatImage} alt="wheat" className="wheat-image" />
          </div>
        </div>
      </section>

    </div>
  )
}

export default PastorPage;