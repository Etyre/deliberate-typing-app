import { sendCompletedSampleData } from "../src/api/api.js";

sendCompletedSampleData({
  dateTimeStart: "2024-03-07 20:00:00.000",
  dateTimeEnd: "2024-03-07 20:01:00.000",
  targetText: "This text is some test text for testing.",
  trainingTokens: [{ text: "text" }, { text: "for" }],
  missedWords: [
    { startPosition: 0, tokenString: "This" },
    { startPosition: 5, tokenString: "text" },
  ],
});
