import React, { createContext, useContext, useState, useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await GetCurrentUser();
        // console.log("User data", user); 
        if (user) {
          // console.log("User is authenticated:", user);
          setUser(user);
        } else {
          console.log("User is not authenticated. Redirecting to login page");
          message.error("Authentication failed");
          setUser(null);
          navigate("/login",{replace:true});

        }
      } catch (error) {
        console.error("Error fetching user:", error);
        message.error("An error occurred during authentication");
        setUser(null);
        navigate("/login", { replace: true });
      }
    };

    if(!user) fetchUser();
  }, [navigate]);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
