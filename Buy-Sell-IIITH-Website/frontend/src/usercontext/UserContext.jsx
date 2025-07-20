import React, { createContext, useContext, useState, useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await GetCurrentUser();
        
        console.log("Response from fetchUser:", response);
        
        if (response.success && response.data) {
          console.log("User is authenticated:", response.data);
          setUser(response.data);
        } else {
          console.log("User is not authenticated. Redirecting to login page");
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Only run once when component mounts
    if (!initialized) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
        setInitialized(true);
        navigate("/login", { replace: true });
      }
    }
  }, [initialized, navigate]); // Only depend on initialized and navigate

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Don't render children until we've determined authentication status
  if (loading || !initialized) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);