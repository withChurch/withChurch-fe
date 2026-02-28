import { useMemo } from "react";
import "./GreetingPage.css";
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

function OfferingSkeleton() {
  return (
    <>
      <section className="body3">
        <div className="body3-content">
          <div className="skeleton" style={{ width: "80%", height: 18, margin: "0 auto 16px" }} />
          <div className="skeleton" style={{ width: "90%", height: 14, margin: "8px auto" }} />
          <div className="skeleton" style={{ width: "70%", height: 14, margin: "8px auto" }} />
        </div>
      </section>

      <section className="offer-table">
        <div className="table-content">
          <table className="offering-common">
            <thead>
              <tr>
                <th>은행명</th>
                <th>계좌번호</th>
                <th>예금주</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((i) => (
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
    </>
  );
}

function OfferingPage(){
  const { config, loading } = useChurchConfig();
  const o = config?.offeringInfo;

  const accountList = useMemo(() => {
    const list = o?.accountList;
    if (!Array.isArray(list)) return [];
    return list.filter(
      (x) => x && (x.bankName || x.accountNumber || x.accountHolder)
    );
  }, [o]);

  const typeList = useMemo(() => {
    const list = o?.offeringTypeList;
    if (!Array.isArray(list)) return [];
    return list.filter(
      (x) => x && (x.typeName || x.depositorFormat)
    );
  }, [o]);

  return (
    <div className="offering-page">
      <Header breadcrumb="> 교회소개 > 온라인 헌금" title="온라인 헌금" />

      {loading ? (
        <OfferingSkeleton />
      ) : (
        <>
          {/* 소개 영역 */}
          <section className="body3">
            <div className="body3-content">
              {o?.offeringVerse ? (
                <span className="highlight1">
                  {cleanText(o.offeringVerse)}
                </span>
              ) : (
                <span className="highlight1">온라인 헌금 안내가 준비중입니다.</span>
              )}

              {o?.offeringIntro && (
                <div
                  className="body3-text"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {cleanText(o.offeringIntro)}
                </div>
              )}
            </div>
          </section>

          {/* 계좌 안내 */}
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
                  {accountList.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        계좌 정보가 준비중입니다.
                      </td>
                    </tr>
                  ) : (
                    accountList.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.bankName}</td>
                        <td>{row.accountNumber}</td>
                        <td>{row.accountHolder}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* 헌금 종류 */}
              <table className="offering-table">
                <thead>
                  <tr>
                    <th>온라인 헌금종류</th>
                    <th>
                      입금자 표기예
                      <br />
                      (이름+생년월일+헌금종류)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typeList.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: "center" }}>
                        헌금 종류 정보가 준비중입니다.
                      </td>
                    </tr>
                  ) : (
                    typeList.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.typeName}</td>
                        <td>{row.depositorFormat}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* 문의처 */}
              <div className="ask-offer">
                <div className="ask-header">
                  <div><p>문의처</p></div>
                </div>
                <div className="ask-container">
                  <div className="ask-text">
                    {o?.contactName || o?.contactPhone || o?.contactEmail ? (
                      <p>
                        <span className="ask-hight">
                          {o?.contactName || "-"}
                        </span>
                        {" / "}
                        {o?.contactPhone || "-"}
                        {" / "}
                        {o?.contactEmail || "-"}
                      </p>
                    ) : (
                      <p>문의처 정보가 준비중입니다.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default OfferingPage;