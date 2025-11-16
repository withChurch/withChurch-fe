import React from "react";
import "./MainPage.css";
import godImg from "../assets/godlovesyou.png";

function MainPage() {
  return (
    <div className="main-container">
      <img src={godImg} alt="God Loves You" className="main-image" />
    </div>
  );
}

export default MainPage;

