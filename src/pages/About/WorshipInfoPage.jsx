import "./GreetingPage.css";
import Header from "../../components/common/Header";
import {Home} from "lucide-react";

function WorshipInfoPage(){
  return(
    <div className="worshipinfo-page">

      <Header
        breadcrumb="> 교회소개 > 예배안내" 
        title="예배안내"
      />

      {/*예배시간테이블*/}
      <section className="worship-table">
        <div className="wortable-contetn">
          <table className="worshipinfo-table">
            <thead>
              <tr>
                <th>예배</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>주일예배 2부</td>
                <td>오전 9시</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>주일예배 3부</td>
                <td>오전 11시 30분</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>주일예배 4부</td>
                <td>오후 1시 30분</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>새벽기도회</td>
                <td>월 - 토 오전 5시</td>
                <td>지하 소예베실</td>
              </tr>

              <tr>
                <td>철야예배</td>
                <td>금 오후 9시</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>유치부</td>
                <td>오전 9시</td>
                <td>지하 프라미스홀</td>
              </tr>

              <tr>
                <td>초등부</td>
                <td>오전 9시</td>
                <td>지하 비전홀</td>
              </tr>

              <tr>
                <td>청소년/청년 예배</td>
                <td>오전 11시 30분</td>
                <td>2층 대예배실</td>
              </tr>

              <tr>
                <td>목장모임</td>
                <td>오후 1시 30분</td>
                <td>1층 카페</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

export default WorshipInfoPage;