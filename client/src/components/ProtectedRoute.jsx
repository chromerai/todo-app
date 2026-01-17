import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return children;
};
