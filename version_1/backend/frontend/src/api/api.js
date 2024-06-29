// To get the sample text from the backend (which gets it from GPT-4), and returns the data as an object.
export async function getTrial() {
  const response = await fetch("/api/sample-text", {
    method: "get",
    headers: {
      authorization: `Bearer ${getCookie("authToken") || ""}`,
    },
  });
  return await response.json();
}

function getCookie(name) {
  // From here https://stackoverflow.com/questions/10730362/get-cookie-by-name
  // This gives us the VALUE of the cookie that has the key which is the string "name"
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
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
  const response = await fetch("/api/sample-run", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("authToken") || ""}`,
    },
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
export async function sendSettingsToBackend({
  trialDisplayMode,
  trainingTokenSourcing,
  batchSize,
  trainingAlgorithm,
  ttsAlgoDeliberatePractice,
  ttsAlgoPrioritizeLapsedTokens,
  ttsAlgoReviewGraduatedTokens,
  tokenHighlighting,
  tokenHighlightingThreshold,
}) {
  const response = await fetch("/api/settings", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("authToken") || ""}`,
    },
    body: JSON.stringify({
      trialDisplayMode: trialDisplayMode,
      trainingTokenSourcing: trainingTokenSourcing,
      batchSize: batchSize,
      trainingAlgorithm: trainingAlgorithm,
      ttsAlgoDeliberatePractice: ttsAlgoDeliberatePractice,
      ttsAlgoPrioritizeLapsedTokens: ttsAlgoPrioritizeLapsedTokens,
      ttsAlgoReviewGraduatedTokens: ttsAlgoReviewGraduatedTokens,
      tokenHighlighting: tokenHighlighting,
      tokenHighlightingThreshold: tokenHighlightingThreshold,
    }),
  });
  return await response.json();
}

export async function signUp({ email, password, confirmPassword }) {
  const response = await fetch("/api/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("authToken") || ""}`,
    },
    body: JSON.stringify({
      newUserData: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    }),
  });
  console.log(response);
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

export async function login({ email, password }) {
  const response = await fetch("/api/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("authToken") || ""}`,
    },
    body: JSON.stringify({
      loginData: {
        email: email,
        password: password,
      },
    }),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}

export async function getCurrentUserFromToken() {
  const token = getCookie("authToken");
  const response = await fetch("/api/user", {
    method: "get",
    headers: { authorization: `Bearer ${token || ""}` },
  });
  const data = await response.json();
  console.log("user data: ", data);
  return data;
}

export async function logout() {
  // We technically don't need this line, since the backend the backend is going to tell the frontend to remove the cookie that has the same name as the one that it sent originally.
  const token = getCookie("authToken");

  const response = await fetch("/api/logout", {
    method: "post",
    headers: { authorization: `Bearer ${token || ""}` },
  });
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
}
