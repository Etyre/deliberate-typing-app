const response = await fetch("http://localhost:5173/api/sample-run", {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzE4NzY1OTU1fQ.N6HsegR4MLjvCQ9wt3BugPilI7a1avS-t-bsOC3oClXzV-1Pkm52LwdIiEvpX4wCgrVSaPGwtI12_FLw4lLJ4U6-sD4F7i5kLyqFFxODfZcWFEleM15aZ9KDgtU_yu-dRMAlkSmU8eR03BAaYSLj80Kep39JeEv1FUgsfVCDkpRkYqUHz9cyxBoBo2HWPprPW75nUJR1v0-yZU3eOPqnyL5r1Iu6sRTmuVDSbekdAkrKC3eMcSkKnDSa5tPBX-c-9PwKtMnFhyof7OMZ_W1nN3m5n7_r4bqwbbOGfpucu2eN2ajJRstLbzM2RP8jVRmVmTE5FPeo2YCn3cJJB2CyVTE5ma6qYVma9qBTUUb9AV7Sldc2iJZt13M1mDLPzCe9ROL22fhtcDuAmQ-vHN7eAgGBiuQ6WrYKXQ1-5D0x5mqD3iXxHVoYn9hXuMcCpwgAp5Q788eKePUYmTNmSnpir1sSGORNBrceCvDw36RyJxLbLRyRHDyfyQQA9-j6eR4eD5PNOopx4TCoRSK0B6QYNB44CCwvl_UBtjXyYYqED79svdiHl1_AelKXLe9OVS1afiNkOxfvR5z_8FbHN_5x5r8-4iWVnz0QwMHUwyi7TDyBq0I4XSbGw8qre12CFQx4o6nqaFyzopvg7Bwi-UWaUcagUI6hCOi9sCDyVr4jDHE",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  },
  referrer: "http://localhost:5173/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
    sampleData: {
      trialData: {
        targetText:
          "She took a moment to fully drink in the magnificence of the sunset. It was an entirely surreal spectacle, every hue imaginable dancing across the sky. The dominant color was a deep, fiery red, and it took her breath away with its undeniable beauty.",
        trainingTokens: [
          {
            id: 68,
            tokenString: "entirely",
            inPersonalizedCorpus: false,
            status: "PENDING",
          },
          {
            id: 67,
            tokenString: "took",
            inPersonalizedCorpus: false,
            status: "PENDING",
          },
          {
            id: 66,
            tokenString: "color",
            inPersonalizedCorpus: false,
            status: "PENDING",
          },
          {
            id: 69,
            tokenString: "magnificence",
            inPersonalizedCorpus: false,
            status: "PENDING",
          },
        ],
        userSettings: {
          hasPaid: false,
          trialDisplayMode: "VISUAL",
          trainingTokenSourcing: "MANUAL_LIST",
          batchSize: 4,
          trainingAlgorithm: "STRICT_WORST_SCORING_FIRST",
          ttsAlgoDeliberatePractice: true,
          ttsAlgoPrioritizeLapsedTokens: true,
          ttsAlgoReviewGraduatedTokens: true,
          tokenHighlighting: "CURRENT_TRAINING_TOKENS",
          tokenHighlightingThreshold: null,
        },
      },
      dateTimeStart: "2024-06-25T06:07:03.902Z",
      dateTimeEnd: "2024-06-25T06:08:01.311Z",
      targetText:
        "She took a moment to fully drink in the magnificence of the sunset. It was an entirely surreal spectacle, every hue imaginable dancing across the sky. The dominant color was a deep, fiery red, and it took her breath away with its undeniable beauty.",
      trainingTokens: [
        {
          id: 68,
          tokenString: "entirely",
          inPersonalizedCorpus: false,
          status: "PENDING",
        },
        {
          id: 67,
          tokenString: "took",
          inPersonalizedCorpus: false,
          status: "PENDING",
        },
        {
          id: 66,
          tokenString: "color",
          inPersonalizedCorpus: false,
          status: "PENDING",
        },
        {
          id: 69,
          tokenString: "magnificence",
          inPersonalizedCorpus: false,
          status: "PENDING",
        },
      ],
      missedWords: [
        { startPosition: 4, tokenString: "took" },
        { startPosition: 40, tokenString: "magnificence" },
        { startPosition: 78, tokenString: "entirely" },
        { startPosition: 164, tokenString: "color" },
        { startPosition: 182, tokenString: "fiery" },
      ],
    },
  }),
  method: "POST",
  mode: "cors",
  credentials: "include",
});

console.log(await response.json());
