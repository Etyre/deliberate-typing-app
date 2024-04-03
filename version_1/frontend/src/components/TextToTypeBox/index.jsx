export default function TextToTypeBox({ textToType, trainingTokens }) {
  function handleText(event) {
    setTextToType(event.target.value);
  }

  console.log(trainingTokens);
  function highlightTrainingTokens(text, trainingTokens) {
    let annotatedTargetText = textToType;
    for (const token of trainingTokens) {
      annotatedTargetText = annotatedTargetText.replaceAll(
        new RegExp("(" + token.tokenString + ")", "ig"),
        `<span class="trainingToken">$1</span>`
      );
    }
    return annotatedTargetText;
  }
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
