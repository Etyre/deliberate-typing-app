import React, { createContext, useState, useEffect } from "react";
import { get } from "react-hook-form";
import { getLoggedInUserFromToken } from "../api/api";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  console.log("loggedInUser: ", loggedInUser);

  useEffect(() => {
    (async () => {
      const user = await getLoggedInUserFromToken();
      console.log("user: ", user);
      setLoggedInUser(user);
    })();
  }, []);

  // Render the AuthContextProvider with the provided value
  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};
