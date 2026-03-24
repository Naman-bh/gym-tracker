import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-wrap flex items-center justify-center">
        <div className="glass p-6">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    const safeRoute = user.role === "trainer" ? "/trainer/dashboard" : "/member/dashboard";
    return <Navigate to={safeRoute} replace />;
  }

  return children;
}
