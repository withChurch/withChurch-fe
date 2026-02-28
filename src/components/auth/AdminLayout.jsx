import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./AdminForm.css";

const AdminLayout = ({ title, children, backTo, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") return onBack();

    if (backTo) return navigate(backTo);

    return navigate(-1);
  };

  return (
    <div className="admin-layout-container">
      <div className="admin-content-wrapper">
        <header className="admin-header">
          <button onClick={handleBack} className="admin-back-btn" aria-label="뒤로가기">
            <ArrowLeft size={24} color="#333" />
          </button>
          <h2 className="admin-page-title">{title}</h2>
        </header>

        <main className="admin-body">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;