import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../usercontext/UserContext";
import Navbar from "../pages/Navbar";
import { Spin } from "antd";

function ProtectedPage({ children }) {
  const { user, loading, initialized } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedPage - user:", user ? "AUTHENTICATED" : "NOT AUTHENTICATED");
    console.log("ProtectedPage - loading:", loading, "initialized:", initialized);
    console.log("ProtectedPage - current path:", location.pathname);
    
    if (initialized && !loading && !user && !['/login', '/register'].includes(location.pathname)) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, loading, initialized, navigate, location.pathname]);

  if (!initialized || loading) {
    console.log("ProtectedPage showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedPage - No user, returning null");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  console.log("ProtectedPage - Rendering protected content");
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}

export default ProtectedPage;