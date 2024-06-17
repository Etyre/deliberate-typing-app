import highlightTrainingTokens from "../src/utils/highlighting-training-tokens.js";

const textToType =
  "In life, we should strive to find serenity amid chaos. It's essential to understand that achieving inner peace isn't about evading life's hardships, but rather about discovering calmness within ourselves, in spite of the turmoil engulfing our external world.";
const trainingTokens = [
  {
    id: 155,
    tokenString: "serenity",
    missRatio: 1,
  },
  {
    id: 151,
    tokenString: "strive",
    missRatio: 1,
  },
  {
    id: 156,
    tokenString: "in",
    missRatio: 1,
  },
  {
    id: 152,
    tokenString: "understand",
    missRatio: 1,
  },
];

console.log("\n", highlightTrainingTokens(textToType, trainingTokens));
