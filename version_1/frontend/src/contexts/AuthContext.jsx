import React, { createContext, useState, useEffect, useMemo } from "react";
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

  //   useEffect(() => {
  //     if (loggedInUser == null) {
  //       setIsAnonUser(true);
  //     }
  //     if (loggedInUser.username == null) {
  //       setIsAnonUser(true);
  //     } else {
  //       setIsAnonUser(false);
  //     }
  //   }, [loggedInUser]);

  const isAnonUser = useMemo(() => {
    if (loggedInUser == null) {
      return true;
    }
    if (loggedInUser.username == null) {
      return true;
    } else {
      return false;
    }
  }, [loggedInUser]);

  // Render the AuthContextProvider with the provided value
  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser, isAnonUser }}>
      {children}
    </AuthContext.Provider>
  );
};
