import React from "react";
import { Info } from "lucide-react";
import "./OfferingInfoPage.css";

export default function OfferingInfoPage() {
  return (
    <div className="offering-info-wrapper">
      <div className="offering-info-box">
        <Info size={46} strokeWidth={1.5} className="offering-info-icon" />

        <h1 className="offering-info-title">헌금 내역 조회 안내</h1>

        <p className="offering-info-text">
          현재 WithChurch에서는 온라인 헌금 내역 조회 기능을 제공하지 않고 있습니다.
        </p>
        <p className="offering-info-text">
          헌금 내역 확인이 필요하신 경우 교회 사무실로 문의 부탁드립니다.
        </p>

        <div className="offering-info-contact">
          <p>사무실 : 010-0000-0000</p>
          <p>Email : withchurch@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
