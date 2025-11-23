import "./GreetingPage.css";
import { HandCoins, Phone } from 'lucide-react';
import KakaoLogo from "../../assets/카카오톡.png";
import InstagramLogo from "../../assets/Instagram_Glyph_Gradient.png";
import FacebookLogo from "../../assets/Facebook_Logo_Primary.png";
import DiscordLogo from "../../assets/Discord-Symbol-Black.png";
import TwitterLogo from "../../assets/logo-black.png";


function OfferingPage(){
  return(
    <div className="offering-page">

      {/*회색바 영역*/}
      <section className="page1">
        <div className="container">
          <div className="title">온라인 헌금</div>
        </div>
      </section>

      {/*소개영역*/}
      <section className="body3">
        <div className="body3-content">
          <span className="highlight1">너희가 여호와께 감사제물을 드리려거든 너희가 기쁘게 받으심이 되도록 드릴지며(레위기 22:29)</span>
          
          <div className="body3-text">
            <p>하나님께 받은 사랑을 하나님께 표현하고 드리는 것은 성도의 마땅한 본분입니다.<br></br>
            드려진 헌금은 하나님의 나라를 확장하며 교회를 건강하게 세우는 일에 사용됩니다.<br></br>
            모든 것이 주께로부터 왔음을 기억하며 감사와 사랑으로 예물을 준비하여 드리는 성도님이 되시기 바랍니다.</p>
            
            <p>교인 여러분이 보내주신 소중한 헌금 감사합니다.</p>

            <p>직접 헌금함에 헌금할 수 없는 분들을 위한 헌금 방법도 마련되어 있으니,<br></br>
            자세한 내용은 하단의 내용을 참고해 주시기 바랍니다.</p>
          </div>
        </div>
      </section>

      <section className="offer-table">
        <div className="table-content">
          <div className="offer-header">
            <HandCoins className="offer-icon" size={50} />
            <div><p>계좌안내</p></div>
          </div>

          <table className="offering-table">
            <thead>
              <tr>
                <th>온라인 헌금종류</th>
                <th>은행명</th>
                <th>계좌번호</th>
                <th>예금주</th>
                <th>입금자 표기예</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>십일조 / 주일헌금</td>
                <td>위드은행</td>
                <td>123-4567-8910-11</td>
                <td>withchurch</td>
                <td>홍길동 십일조 / 주일</td>
              </tr>
              <tr>
                <td>장학헌금</td>
                <td>위드은행</td>
                <td>123-4567-8910-12</td>
                <td>withchurch</td>
                <td>홍길동 장학</td>
              </tr>
              <tr>
                <td>선교헌금</td>
                <td>위드은행</td>
                <td>123-4567-8910-13</td>
                <td>withchurch</td>
                <td>홍길동 선교</td>
              </tr>
              <tr>
                <td>건축헌금</td>
                <td>위드은행</td>
                <td>123-4567-8910-14</td>
                <td>withchurch</td>
                <td>홍길동 건축</td>
              </tr>
              <tr>
                <td>나눔헌금</td>
                <td>위드은행</td>
                <td>123-4567-8910-15</td>
                <td>withchurch</td>
                <td>홍길동 나눔</td>
              </tr>
            </tbody>
          </table>

          <div className="ask-offer">
            <div className="ask-header">
              <Phone className="ask-icon" size={50} />
              <div><p>문의처</p></div>
            </div>
            <div className="ask-container">
              <div className="ask-text">
                <p><span className="ask-hight">With Church</span> / withchurch1234@hufs.ac.kr</p>
              </div>
            </div>
            <div className="ask-logos">
              <div className="ask-logo-item">
                <img src={KakaoLogo} alt="카카오톡 로고" className="ask-logo" />
              </div>
              <div className="ask-logo-item">
                <img src={InstagramLogo} alt="인스타그램 로고" className="ask-logo" />
              </div>
              <div className="ask-logo-item">
                <img src={FacebookLogo} alt="페이스북 로고" className="ask-logo" />
              </div>
              <div className="ask-logo-item">
                <img src={DiscordLogo} alt="디스코드 로고" className="ask-logo" />
              </div>
              <div className="ask-logo-item">
                <img src={TwitterLogo} alt="트위터 로고" className="ask-logo" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default OfferingPage;