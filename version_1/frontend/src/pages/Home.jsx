import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";
import { useEffect, useState } from "react";
import { getSampleText, sendCompletedSampleData } from "../api/api.js";

export default function Home() {
  const [textToType, setTextToType] = useState("");

  useEffect(() => {
    async function getSampleAndSetTextToType() {
      const responseText = await getSampleText();
      setTextToType(responseText);
    }
    getSampleAndSetTextToType();
  }, []);

  return (
    <>
      <div className="textAndTypingContainer">
        <TextToTypeBox textToType={textToType}></TextToTypeBox>
        <Typingbox key={textToType} textToType={textToType}></Typingbox>
      </div>
    </>
  );
}
