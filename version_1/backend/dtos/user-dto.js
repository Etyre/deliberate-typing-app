export default class UserDto {
  id;
  username;
  emailAddress;
  hasPaid;
  trialDisplayMode;
  trainingTokenSourcing;
  batchSize;
  trainingAlgorithm;
  ttsAlgoDeliberatePractice;
  ttsAlgoPrioritizeLapsedTokens;
  ttsAlgoReviewGraduatedTokens;
  tokenHighlighting;
  tokenHighlightingThreshold;
  trainingThreshold;

  constructor(data) {
    for (const key in this) {
      this[key] = data[key];
    }
  }
}
