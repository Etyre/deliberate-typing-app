import React, { createContext, useState, useEffect, useMemo } from "react";
import { getLoggedInUserFromToken } from "../api/api";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  console.log("currentUser: ", currentUser);

  useEffect(() => {
    (async () => {
      const user = await getLoggedInUserFromToken();
      console.log("user: ", user);
      setCurrentUser(user);
    })();
  }, []);

  //   useEffect(() => {
  //     if (currentUser == null) {
  //       setIsAnonUser(true);
  //     }
  //     if (currentUser.username == null) {
  //       setIsAnonUser(true);
  //     } else {
  //       setIsAnonUser(false);
  //     }
  //   }, [currentUser]);

  const isAnonUser = useMemo(() => {
    if (currentUser == null) {
      return true;
    }
    if (currentUser.username == null) {
      return true;
    } else {
      return false;
    }
  }, [currentUser]);

  // Render the AuthContextProvider with the provided value
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isAnonUser }}>
      {children}
    </AuthContext.Provider>
  );
};
