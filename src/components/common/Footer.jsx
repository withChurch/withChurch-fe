// src/components/common/Footer.jsx
import React from "react";
import "./Footer.css";
import {Facebook, Youtube, Instagram} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-text">
          사무실: 서울특별시 서초구 바우뫼로6길 56 삽준빌딩 3층 / TEL: 02-597-0691 │ FAX: 02-597-0601
          <br />
          Copyright(C) Saeroun All Rights Reserved.
        </div>

        <div className="footer-auth">
          <Facebook size={22} />
          <Instagram size={22} />
          <Youtube size={22} />
        </div>

        <div className="footer-squares">
          <span className="footer-square" />
          <span className="footer-square" />
          <span className="footer-square" />
        </div>
      </div>
    </footer>
  );
}