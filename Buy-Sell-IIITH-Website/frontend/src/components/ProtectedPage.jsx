import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../usercontext/UserContext";
import Navbar from "../pages/Navbar";

function ProtectedPage({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated. Redirecting to login page");
      navigate("/login", { replace: true });
    }
  }, [user, navigate]); 

  if (!user) {
    return null; 
  }

  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}

export default ProtectedPage;

