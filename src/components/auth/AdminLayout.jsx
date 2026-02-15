import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./AdminForm.css";

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-layout-container">
      <div className="admin-content-wrapper">
        
        <header className="admin-header">
          <button onClick={() => navigate(-1)} className="admin-back-btn">
            <ArrowLeft size={24} color="#333" />
          </button>
          <h2 className="admin-page-title">{title}</h2>
        </header>

        <main className="admin-body">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;