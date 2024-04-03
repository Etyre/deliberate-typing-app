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

  useEffect(() => {
    if (!currentTrial && onDeckTrial) {
      setCurrentTrial(onDeckTrial);
      setOnDeckTrial(null);
    }
  }, [currentTrial, onDeckTrial]);
  // Sometimes we do something (currently with a button), that sets currentTrial to null, to start this cascade.

  useEffect(() => {
    async function getTrialForOnDeck() {
      if (!onDeckTrial) {
        const trial = await getTrial();
        setOnDeckTrial(trial);
      }
    }
    getTrialForOnDeck();
  }, [onDeckTrial]);

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
              setCurrentTrial={setCurrentTrial}
            ></Typingbox>
          </div>
        )}
        {activeView == "OPTIONS_PANEL" && (
          <div>
            <OptionsPanel></OptionsPanel>
          </div>
        )}
      </div>
    </div>
  );
}
