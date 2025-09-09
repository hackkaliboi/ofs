import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TEMPORARY: Bypass authentication check
  return <Outlet />;

  /* Original authentication logic (commented out temporarily)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
  */
};

export default PrivateRoute;
