import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";
import { useEffect, useState } from "react";
import { getTrial, sendCompletedSampleData } from "../api/api.js";

export default function Home() {
  const [textToType, setTextToType] = useState("");
  const [trainingTokens, setTrainingTokens] = useState([]);

  useEffect(() => {
    async function getSampleAndSetTextToType() {
      const trial = await getTrial();
      console.log(trial);
      setTextToType(trial.targetText);
      setTrainingTokens(trial.trainingTokens);
    }
    getSampleAndSetTextToType();
  }, []);

  console.log(trainingTokens);

  return (
    <>
      <div className="textAndTypingContainer">
        <TextToTypeBox textToType={textToType}></TextToTypeBox>
        <Typingbox
          key={textToType}
          trainingTokens={trainingTokens}
          targetText={textToType}
        ></Typingbox>
      </div>
    </>
  );
}
