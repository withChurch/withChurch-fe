import "./GreetingPage.css";

function GreetingPage(){
  return(
    <div className="greeting-page">

      <senction className="page1">
        <div className="title">
          인사말
        </div>
      </senction>
      
      {/*말씀구절*/}
      <section className="wheat-quote">
        <div className="content1">
          <p className="quote-text">
            "날마다 마음을 같이하여 성전에 모이기를 힘쓰고 집에서 떡을 떼며 
            기쁨과 순전한 마음으로 음식을 먹고 하나님을 찬미하여 또 온 백성에게
            칭송을 받으니 주께서 구원 받는 사람을 날마다 더하게 하시니라" (사도행전 2장 46-47절)
          </p>
        </div>
      </section>

      <section className="body">
        <div className="body-text">
          <h2>With Church 홈페이지에 방문해 주심을 감사합니다.</h2>
          <p>
            With Church는 신약교회의 온전한 회복을 소망하며 OOO 목사가 개척을 하였습니다.
          </p>
          <p>
            예수 그리스도의 은혜, 하나님의 사랑, 그리고 성령의 교통(나눔)은 기독교 신앙의 핵심중의 핵심입니다.
          </p>
          <p><span className="highlight">은혜와 사랑이 삶의 기초가</span> 되고 <br/>
          <span className="highlight">나눔이 삶의 열매가</span> 되는 <span className="highlight">나눔과 섬김의 공동체</span>입니다.
          </p>

          <ol className="body-list">
            <li>새벽예배</li>
            <li>주일예배</li>
            <li>목장모임</li>
          </ol>

          <p>여러분들의 삶과 가정 속에 예수 그리스도의 사랑과 은혜가 충만하시기를 기원합니다.
          </p>
        </div>
      </section>
    </div>
  );
}

export default GreetingPage;