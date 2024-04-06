// To get the sample text from the backend (which gets it from GPT-4), and returns the data as an object.
export async function getTrial() {
  const response = await fetch("http://localhost:5173/api/sample-text", {
    method: "get",
  });
  return await response.json();
}

// To send the data from a completed sample run to the backend

export async function sendCompletedSampleData({
  trialData,
  dateTimeStart,
  dateTimeEnd,
  targetText,
  trainingTokens,
  missedWords,
}) {
  const response = await fetch("http://localhost:5173/api/sample-run", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sampleData: {
        trialData: trialData,
        dateTimeStart: dateTimeStart,
        dateTimeEnd: dateTimeEnd,
        targetText: targetText,
        trainingTokens: trainingTokens,
        missedWords: missedWords,
      },
    }),
  });
  return true;
}
