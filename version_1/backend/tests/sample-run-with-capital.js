const response = await fetch("http://localhost:5173/api/sample-run", {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  },
  referrer: "http://localhost:5173/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: '{"sampleData":{"dateTimeStart":"2024-03-29T04:00:30.299Z","dateTimeEnd":"2024-03-29T04:02:13.046Z","targetText":"Please, allow me to elaborate on the craft of essay writing. Fundamentally, every strong essay includes multiple well-crafted paragraphs. Each paragraph should have a central idea and theme, serving as an integral building block to support the main argument. Like a beautiful puzzle, every piece adds value, and a paragraph is no exception as it helps in advancing the overall narrative.","trainingTokens":[{"id":1,"tokenString":"paragraph","missRatio":0.7142857142857143},{"id":2,"tokenString":"includes","missRatio":0},{"id":3,"tokenString":"please","missRatio":0}],"missedWords":[{"startPosition":301,"tokenString":"value"}]}}',
  method: "POST",
  mode: "cors",
  credentials: "omit",
});

console.log(await response.json());
