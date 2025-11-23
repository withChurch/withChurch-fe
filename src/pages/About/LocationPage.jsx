import "./Location.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Train, Bus } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "430px",
};

const center = {
  lat: 37.573589,
  lng: 127.001602,
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

function MapView() {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <iframe
        className="map-iframe"
        title="위드처치 위치 안내"
        src={`https://www.google.com/maps?q=${center.lat},${center.lng}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

function LocationPage() {
  return (
    <div className="location-page">
      <header className="location-header">
        <h1>찾아오시는 길</h1>
      </header>

      <section className="location-map-section">
        <div className="location-map-card">
          <MapView />
          <p className="location-address">서울 종로구 김상욱로 37</p>
        </div>
      </section>

      <section className="location-guide">
        <div className="guide-item">
          <div className="guide-icon">
            <Train size={48} strokeWidth={1.4} />
          </div>
          <div className="guide-text">
            <h2>지하철을 이용하는 경우</h2>
            <strong>종로 5가역</strong>
            <p>지하철 1호선 종로5가역에서 하차하여 2번 출구로 나와 대학교 방향으로 200M 오시면 됩니다.</p>
          </div>
        </div>

        <div className="guide-item">
          <div className="guide-icon">
            <Bus size={48} strokeWidth={1.4} />
          </div>
          <div className="guide-text">
            <h2>시내버스를 이용하는 경우</h2>
            <strong>종로 5가역</strong>
            <p>지하철 1호선 종로5가역에서 하차하여 2번 출구로 나와 대학로 방향으로 200M 오시면 됩니다.</p>
          </div>
        </div>
      </section>

      <footer className="location-footer">
        <p><span className="footer-name">WithChurch</span><br></br>
        서울 종로구 종로서 00길 12 TEL:02-1234-1234 FAX:02-123-1234<br></br>
        ⓒCopyright2025WithChurch All Right Reserved<br></br>
        Programmed by @WithTeam</p>
      </footer>
    </div>
  );
}

export default LocationPage;