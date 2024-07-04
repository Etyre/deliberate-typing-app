import React, { createContext, useState, useEffect, useMemo } from "react";
import { getCurrentUserFromToken, sendSettingsToBackend } from "../api/api";

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
  // This function does two things: it sends the new settings to the backend database, and then it updates the state memo that is holding the settings her on the frontend.
  async function setSettings(newSettings) {
    // Send the new settings to the backend
    await sendSettingsToBackend(newSettings);
    // Update the frontend settings memo
    setCurrentUser({ ...currentUser, ...newSettings });
    // Note that the way the line above is structured, it will overwrite any settings that are already in the currentUser object with the new settings. This is the desired behavior.
  }

  // Render the AuthContextProvider with the provided value
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isAnonUser, settings, setSettings }}
    >
      {children}
    </AuthContext.Provider>
  );
};
