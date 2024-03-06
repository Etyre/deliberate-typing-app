import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";
import { useEffect, useState } from "react";

export default function Home() {
  const [textToType, setTextToType] = useState("");
  // const [isLoadingSample, setIsLoadingSample] = useState(false);

  useEffect(() => {
    // if (isLoadingSample == false) {
    async function getSampleAndSetTextToType() {
      // setIsLoadingSample(true);
      const response = await fetch("http://localhost:5173/api/sample", {
        method: "get",
      });
      setTextToType(await response.text());
      // setIsLoadingSample(false);
    }
    getSampleAndSetTextToType();
    // }
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
