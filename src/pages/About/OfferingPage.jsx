import "./GreetingPage.css";

import { Home } from 'lucide-react';

function OfferingPage(){
  return(
    <div className="offering-page">

      <div className="intro-breadcrumb">
        <Home 
          size={15}
          style={{verticalAlign: "middle", marginRight: 6, marginBottom: 2}}
        />
        <span>{"> 교회소개 > 온라인 헌금"}</span>
      </div>

      <section className="page1">
        <div className="title-wrapper">
          <p className="title">온라인 헌금</p>
          <div className="divi-line"></div>
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

      {/*헌금테이블*/}
      <section className="offer-table">
        <div className="table-content">
          <div className="offer-header">
            <div><p>계좌안내</p></div>
          </div>

          <table className="offering-common">
            <thead>
              <tr>
                <th>은행명</th>
                <th>계좌번호</th>
                <th>예금주</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>위드은행</td>
                <td>123-4567-8910-11</td>
                <td>withchurch</td>
              </tr>
            </tbody>
          </table>

          <table className="offering-table">
            <thead>
              <tr>
                <th>온라인 헌금종류</th>
                <th>
                  입금자 표기예
                  <br />
                  (이름+생년월일+헌금종류 )
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>십일조 / 주일헌금</td>
                <td>홍길동990101십 / 주</td>
              </tr>
              <tr>
                <td>감사헌금</td>
                <td>홍길동990101감</td>
              </tr>
              <tr>
                <td>장학헌금</td>
                <td>홍길동990101장</td>
              </tr>
              <tr>
                <td>선교헌금</td>
                <td>홍길동990101선</td>
              </tr>
              <tr>
                <td>건축헌금</td>
                <td>홍길동990101건</td>
              </tr>
              <tr>
                <td>나눔헌금</td>
                <td>홍길동990101나</td>
              </tr>
            </tbody>
          </table>

          {/*문의처*/}
          <div className="ask-offer">
            <div className="ask-header">
              <div><p>문의처</p></div>
            </div>
            <div className="ask-container">
              <div className="ask-text">
                <p><span className="ask-hight">With Church</span> / 02-123-456 / withmoney1234@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OfferingPage;