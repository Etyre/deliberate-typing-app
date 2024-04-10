import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";
import { useEffect, useState } from "react";
import { getTrial, sendCompletedSampleData } from "../api/api.js";
import OptionsPanel from "../components/OptionsPanel/index.jsx";
import NavBar from "../components/NavBar/index.jsx";

export default function Home() {
  const [currentTrial, setCurrentTrial] = useState(null);
  const [onDeckTrial, setOnDeckTrial] = useState(null);

  const [textToType, setTextToType] = useState("");
  const [trainingTokens, setTrainingTokens] = useState([]);

  /**
   * @type {[ "TYPING"| "OPTIONS_PANEL" | "STATS",]}
   */
  const [activeView, setActiveView] = useState("TYPING");

  // If any of the following user settings change, we set both the current and the onDeck trial to null, which triggers a cascade of API calls to produce a new trial in the UX.
  // useEffect(() => {
  //   setCurrentTrial(null);
  //   setOnDeckTrial(null);
  // }, [
  //   currentTrial.userSettings.trialDisplayMode,
  //   currentTrial.userSettings.trainingTokenSouring,
  //   currentTrial.userSettings.batchSize,
  //   currentTrial.userSettings.trainingAlogorithm,
  // ]);

  // If the current trial is set to null, we move up the onDeck trial into the currentTrial position, and set onDeckTrial to null.
  // Setting the current trial to null is the way that we trigger the cascade.
  useEffect(() => {
    if (!currentTrial && onDeckTrial) {
      // this line /\ is for ordering. It's basically saying "wait until we have a new on deck trial, before running the following code."
      setCurrentTrial(onDeckTrial);
      setOnDeckTrial(null);
    }
  }, [currentTrial, onDeckTrial]);

  // When the onDeckTrial is null, we get a new one.
  useEffect(() => {
    async function getTrialForOnDeck() {
      if (!onDeckTrial) {
        const trial = await getTrial();
        setOnDeckTrial(trial);
      }
    }
    getTrialForOnDeck();
  }, [onDeckTrial]);

  // When we get a new currentTrial, we update the UI.
  useEffect(() => {
    if (currentTrial) {
      setTextToType(currentTrial.targetText);
      setTrainingTokens(currentTrial.trainingTokens);
    }
    // This is in an "if" clause, so that it doesn't trigger in brief periods when currentTrial is null.
  }, [currentTrial]);

  console.log(trainingTokens);

  return (
    <div>
      <NavBar navigationFunction={setActiveView}></NavBar>
      <div>
        {activeView == "TYPING" && (
          <div className="textAndTypingContainer">
            <TextToTypeBox
              trainingTokens={trainingTokens}
              textToType={textToType}
            ></TextToTypeBox>
            <Typingbox
              key={textToType}
              trainingTokens={trainingTokens}
              targetText={textToType}
              currentTrial={currentTrial}
              setCurrentTrial={setCurrentTrial}
            ></Typingbox>
          </div>
        )}
        {activeView == "OPTIONS_PANEL" && (
          <div>
            <OptionsPanel
              currentTrialSettings={currentTrial.userSettings}
            ></OptionsPanel>
          </div>
        )}
      </div>
    </div>
  );
}
