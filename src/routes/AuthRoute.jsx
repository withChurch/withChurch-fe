import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";   // ⭐ 이거 반드시 있어야 함!

export default function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
