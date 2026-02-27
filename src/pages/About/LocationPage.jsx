import { useMemo } from "react";
import "./Location.css";
import Header from "../../components/common/Header";

import { useChurchConfig } from "../../contexts/ChurchConfigContext";

const cleanText = (text = "") =>
  String(text)
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

const extractMapSrc = (raw = "") => {
  const s = String(raw).trim();
  if (!s) return "";

  //src="..." 형태
  const m1 = s.match(/src\s*=\s*"([^"]+)"/i);
  if (m1?.[1]) return m1[1];

  //src='...' 형태
  const m2 = s.match(/src\s*=\s*'([^']+)'/i);
  if (m2?.[1]) return m2[1];

  //URL 뒤에 " width=" 같은 게 붙어있는 경우
  const cut = s.split('"')[0];
  return cut;
};

function LocationSkeleton() {
  return (
    <>
      {/* Map skeleton */}
      <section className="map-sec">
        <div className="map-wrapper">
          <div className="skeleton skeleton-map" />
        </div>
      </section>

      {/* Address skeleton */}
      <section className="location-guide">
        <div className="location-info">
          <div className="skeleton skeleton-section-title" />
        </div>

        <div className="location-box">
          <div className="skeleton skeleton-label" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      </section>

      {/* Transport skeleton */}
      <section className="transport-guide">
        <div className="transport-info">
          <div className="skeleton skeleton-section-title" />

          {[1, 2, 3].map((i) => (
            <div className="trans-box" key={i}>
              <div className="skeleton skeleton-box-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function LocationPage() {
  const { config, loading } = useChurchConfig();
  const d = config?.directionInfo;

  const mapSrc = useMemo(
    () => extractMapSrc(d?.mapEmbedUrl),
    [d?.mapEmbedUrl]
  );

  const address = cleanText(d?.churchAddress || "");
  const guides = Array.isArray(d?.transportGuide) ? d.transportGuide : [];

  return (
    <div className="location-page">
      <Header breadcrumb="> 오시는 길" title="오시는 길" />

      {loading ? (
        <LocationSkeleton />
      ) : (
        <>
          <section className="map-sec">
            <div className="map-wrapper">
              <iframe
                src={mapSrc}
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
              <p className="location-adr" style={{ whiteSpace: "pre-line" }}>
                {address || "-"}
              </p>
            </div>
          </section>

          <section className="transport-guide">
            <div className="transport-info">
              <p className="transport-head">교통안내</p>

              {guides.map((g, idx) => (
                <div className="trans-box" key={`${g.title}-${idx}`}>
                  <p className="trans-head">{g.title}</p>
                  <p className="trans-dis" style={{ whiteSpace: "pre-line" }}>
                    {cleanText(g.body)}
                  </p>
                </div>
              ))}
              
              {guides.length === 0 && (
                <div className="trans-box">
                  <p className="trans-head">안내</p>
                  <p className="trans-dis">교통 안내 정보가 준비 중입니다.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default LocationPage;
