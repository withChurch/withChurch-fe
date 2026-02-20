import "./Location.css";
import Header from "../../components/common/Header";
import { Train, Bus, Home } from "lucide-react";

function LocationPage() {
  return (
    <div className="location-page">

      <Header
        breadcrumb="> 오시는 길" 
        title="오시는 길"
      />

      {/* ✅ 여기만 교체됨 */}
      <section className="map-sec">
        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.6650675076694!2d127.02521227570814!3d37.46862922973641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca12641b1d683%3A0x489cd1150f396a1!2s56%20Baumoe-ro%206-gil%2C%20Seocho%20District%2C%20Seoul!5e0!3m2!1sen!2skr!4v1771164417137!5m2!1sen!2skr"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: 12 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="교회 위치"
          />
        </div>
      </section>

      <section className="location-guide">
        <div className="location-info">
          <p className="location-head">교회정보</p>
        </div>

        <div className="location-box">
          <p className="location-add">주소</p>
          <p className="location-adr">
            (우) 12345 서울특별시 서초구 바우뫼로6길 56 삽준빌딩 3층
          </p>
        </div>
      </section>

      <section className="transport-guide">
        <div className="transport-info">
          <p className="transport-head">교통안내</p>

          <div className="trans-box">
            <p className="trans-head">주차이용안내</p>
            <p className="trans-dis">
              교회 내부 주차장은 장소가 매우 협소합니다.
              <br />
              주차가 불가할 수 있으니 가급적 대중교통을 이용하여 예배에 참석해주세요.
            </p>
          </div>

          <div className="trans-box">
            <p className="trans-head">지하철을 이용하여 오시는 방법</p>
            <p className="trans-dis">
              지하철 1호선 종로5가역 2번 출구 (도보 10분)
            </p>
          </div>

          <div className="trans-box">
            <p className="trans-head">버스를 이용하여 오시는 방법</p>
            <p className="trans-dis">
              지하철 1호선 종로5가역 2번 출구 (도보 10분)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LocationPage;
