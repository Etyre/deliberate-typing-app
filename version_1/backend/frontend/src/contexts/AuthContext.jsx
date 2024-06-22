import React, { createContext, useState, useEffect, useMemo } from "react";
import { getCurrentUserFromToken } from "../api/api";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  console.log("currentUser: ", currentUser);

  // Fetch the current user from the token
  useEffect(() => {
    (async () => {
      const user = await getCurrentUserFromToken();
      console.log("user: ", user);
      setCurrentUser(user);
    })();
  }, []);

  // Determine if the current user is an anonymous user or a logged in account.
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

  // Create a settings object from the currentUser object
  const settings = useMemo(
    () =>
      currentUser
        ? {
            trialDisplayMode: currentUser.trialDisplayMode,
            trainingTokenSourcing: currentUser.trainingTokenSourcing,
            batchSize: currentUser.batchSize,
            ttsAlgoDeliberatePractice: currentUser.ttsAlgoDeliberatePractice,
            ttsAlgoPrioritizeLapsedTokens:
              currentUser.ttsAlgoPrioritizeLapsedTokens,
            ttsAlgoReviewGraduatedTokens:
              currentUser.ttsAlgoReviewGraduatedTokens,
            trainingAlgorithm: currentUser.trainingAlgorithm,
            tokenHighlighting: currentUser.tokenHighlighting,
            tokenHighlightingThreshold: currentUser.tokenHighlightingThreshold,
          }
        : null,
    [currentUser]
  );

  // Render the AuthContextProvider with the provided value
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isAnonUser, settings }}
    >
      {children}
    </AuthContext.Provider>
  );
};
