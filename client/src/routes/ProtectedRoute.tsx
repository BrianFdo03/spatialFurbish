import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
  requireVerified?: boolean;
}

export default function ProtectedRoute({
  allowedRoles = [],
  children,
  requireVerified = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Wait until auth is resolved
  if (loading) {
    return <FullPageSpinner />;
  } // or a spinner

  // Not logged in
  if (!user) {
    toast.error("Access Denied: Login is required to access this page");
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error("Access Denied: You do not have permission to view this page");
    return <Navigate to="/" replace />;
  }

  // Just incase if unverified users needed for some pages
  if (requireVerified && !user.verified) {
    toast.error("Access Denied: Your account is not verified yet");
    return <Navigate to="/" replace />;
  }

  return children;
}
