import highlightTrainingTokens from "../utils/highlighting-training-tokens.js";

export default function TextToTypeBox({ textToType, trainingTokens }) {
  function handleText(event) {
    setTextToType(event.target.value);
  }

  console.log("trainingTokens: ", trainingTokens);

  const annotatedTargetText = highlightTrainingTokens(
    textToType,
    trainingTokens
  );
  console.log(annotatedTargetText);
  return (
    <div className="textToTypeBox">
      <p dangerouslySetInnerHTML={{ __html: annotatedTargetText }}></p>
    </div>
  );
}
