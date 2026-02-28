import { useMemo } from "react";
import "./GreetingPage.css";
import Header from "../../components/common/Header";

import { useChurchConfig } from "../../contexts/ChurchConfigContext";

const cleanText = (text = "") =>
  String(text)
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .trim();

function WorshipSkeleton() {
  return (
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
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td><div className="skeleton skeleton-td" /></td>
                <td><div className="skeleton skeleton-td" /></td>
                <td><div className="skeleton skeleton-td" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WorshipInfoPage(){
  const { config, loading } = useChurchConfig();

  const worshipList = useMemo(() => {
    const list = config?.worshipInfo?.worshipList;
    if (!Array.isArray(list)) return [];

    return list
      .filter((x) => x && (x.serviceName || x.timeText || x.locationText))
      .map((x) => ({
        serviceName: cleanText(x.serviceName),
        timeText: cleanText(x.timeText),
        locationText: cleanText(x.locationText),
        order: typeof x.order === "number" ? x.order : 9999,
      }))
      .sort((a, b) => a.order - b.order);
  }, [config]);

  return (
    <div className="worshipinfo-page">
      <Header breadcrumb="> 교회소개 > 예배안내" title="예배안내" />

      {loading ? (
        <WorshipSkeleton />
      ) : (
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
                {worshipList.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "18px 0" }}>
                      예배 안내가 준비중입니다.
                    </td>
                  </tr>
                ) : (
                  worshipList.map((row, idx) => (
                    <tr key={`${row.serviceName}-${idx}`}>
                      <td>{row.serviceName || "-"}</td>
                      <td>{row.timeText || "-"}</td>
                      <td>{row.locationText || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default WorshipInfoPage;