import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

// 🔐 Protect pages that require login
export const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = true

  return isAuthenticated ? children : <Navigate to="/landing-page" replace />;
};

// 🚪 Redirect logged-in users away from login/signup pages
export const LoginAuthentication = ({ children }: Props) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  return isAuthenticated ? <Navigate to="/brainimagining" replace /> : children;
};
