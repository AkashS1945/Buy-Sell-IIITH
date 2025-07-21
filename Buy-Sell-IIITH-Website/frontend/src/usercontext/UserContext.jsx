import React, { createContext, useContext, useState, useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("fetchUser called - Current location:", location.pathname);
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log("Token from localStorage:", token ? "EXISTS" : "NOT FOUND");
        
        if (!token) {
          console.log("No token found - setting user to null");
          setUser(null);
          setLoading(false);
          setInitialized(true);
          return;
        }

        const response = await GetCurrentUser();
        
        
        if (response && response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error in fetchUser:", error);
        console.log("Removing token due to error");
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        console.log("fetchUser completed");
        setLoading(false);
        setInitialized(true);
      }
    };

    if (!initialized) {
      console.log("UserProvider initializing...");
      fetchUser();
    }
  }, [initialized]);

  const clearUser = () => {
    console.log("Clearing user data");
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const contextValue = {
    user,
    setUser,
    clearUser,
    loading,
    initialized
  };

  console.log("UserContext providing:", { 
    user: user ? `User: ${user.firstName} ${user.lastName}` : null, 
    loading, 
    initialized,
    location: location.pathname
  });

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};