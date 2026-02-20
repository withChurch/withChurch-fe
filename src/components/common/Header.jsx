// src/components/common/Header.jsx
import "./Header.css";
import { Home } from "lucide-react";

export default function Header({ title, breadcrumb }) {
  return (
    <>
      {breadcrumb && (
        <div className="intro-breadcrumb">
          <Home size={15} style={{ verticalAlign: "middle", marginRight: 6, marginBottom: 2 }} />
          <span>{`${breadcrumb}`}</span>
        </div>
      )}

      <section className="page1">
        <div className="title-wrapper">
          <p className="title">{title}</p>
          <div className="divi-line" />
        </div>
      </section>
    </>
  );
}