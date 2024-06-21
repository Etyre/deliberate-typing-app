export default function highlightTrainingTokens(textToType, trainingTokens) {
  let annotatedTargetText = textToType;

  if (trainingTokens.length > 0) {
    // we need to make RegEx string that means "match any of these substrings", from the list of training tokens.
    const regexArray = trainingTokens.map((token) => {
      return "(" + token.tokenString + ")";
    });

    const regexString = regexArray.join("|");

    annotatedTargetText = annotatedTargetText.replaceAll(
      new RegExp(regexString, "ig"),
      `<span class="trainingToken">$&</span>`
    );
  }
  // (The $1 stands for the substring that was found in the original (textToType) string.)
  // }
  return annotatedTargetText;
}
