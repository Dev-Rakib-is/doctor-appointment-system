import { Navigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10 container mx-auto">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
