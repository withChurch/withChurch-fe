import { useState } from "react";
import "./GreetingPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Worshipimg from "../../assets/worship.png";
import Prayimg from "../../assets/pray.png";
import Crossimg from "../../assets/cross.png";

function WorshipInfoPage(){
  const slides = [Worshipimg, Prayimg, Crossimg];
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return(
    <div className="worshipinfo-page">
      {/*회색바 영역*/}
      <section className="page1">
        <div className="container">
          <div className="title">예배안내</div>
        </div>
      </section>

      {/*사진영역*/}
      <section className="worship-pic">
        <button
          type="button"
          className="img-arrow img-arrowl"
          onClick={handlePrev}
          aria-label="이전 이미지"
        >
          <ChevronLeft size={48} />
        </button>

        <div className="worship-slider">
          <img
            src={slides[activeIndex]}
            alt="예배 안내 이미지"
            className="worship-slide"
          />
        </div>

        <button
          type="button"
          className="img-arrow img-arrowr"
          onClick={handleNext}
          aria-label="다음 이미지"
        >
          <ChevronRight size={48} />
        </button>
      </section>

      {/*예배시간테이블*/}
      <section className="worship-table">
        <div className="wortable-contetn">
          <div className="worship-header">
            <p>예배시간</p>
          </div>

          <table className="worshipinfo-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>주일예배</td>
                <td>주일 오전 11시</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>유치부, 초등부</td>
                <td>주일 오전 10시</td>
                <td>지하 소예배실</td>
              </tr>

              <tr>
                <td>청소년 / 청년 예배</td>
                <td>주일 오전 11시</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>청소년 / 청년 위드모임</td>
                <td>주일 오후 2시</td>
                <td>지하 소예베실</td>
              </tr>

              <tr>
                <td>새벽기도회</td>
                <td>월 - 토 오전 5시</td>
                <td>지하 소예배실</td>
              </tr>

              <tr>
                <td>목장모임</td>
                <td>목장별</td>
                <td>목장별 상황에 맞게</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

export default WorshipInfoPage;