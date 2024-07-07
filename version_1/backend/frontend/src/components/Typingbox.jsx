import { useEffect, useState, useRef, useMemo } from "react";
import ContentEditable from "./ContentEditable";
import { sendCompletedSampleData } from "../api/api";

/**
 * @param {string} text
 */

function parseText(text) {
  const theWordAndPunctIterator = text.matchAll(/[\w']+|[^\w\s']/g);
  // this returns an iterator
  // It returns everything that's either a word or a punctuation mark.

  const arrayOfRegexMatches = [...theWordAndPunctIterator];
  // This is an array of arrays.

  // Note that the punctuation marks are all at the front, instead of in order between the words. This is fine, we're putting them back in order later, but don't get confused about it.

  // Elements: 0th: the matched string
  // The postition of the first charcater is the the .index property of the array. (These arrays have an index property)
  // To find out more read documentation on RegExpMatchArray

  const arrayOfTokenInfos = arrayOfRegexMatches.map((element) => ({
    startPosition: element.index,
    tokenString: element[0],
  }));

  return arrayOfTokenInfos;
}

function compareTexts(targetText, text) {
  const parsedTargetText = parseText(targetText);
  const parsedText = parseText(text);

  let tokenInfosOfMatchingWords = [];
  let tokenInfosOfMismatchingWords = [];

  for (
    let index = 0;
    index < Math.max(parsedText.length, parsedTargetText.length);
    index++
  ) {
    const element = parsedText[index];

    if (!element || !parsedTargetText[index]) {
      break;
    }

    console.log(
      "parsedTargetText[index].tokenString: ",
      parsedTargetText[index].tokenString
    );

    console.log("element.tokenString: ", element.tokenString);

    // This code is a little weird. We're checking if a given token is correct. And we're using a different criterion for the last typed token, then for all the other typed tokens. For the last typed token, we want to know if it is correct so far. For all the other typed tokens, we want to know if it is correct and complete. We're checking for those conditions, putting them in variables, and then evaluating those varibles in a conditional.
    const isNonMostRecentTypedTokenAndIsComplete =
      index < parsedText.length &&
      parsedTargetText[index].tokenString == element.tokenString;

    const isMostRecentTypedTokenAndIsCorrectSoFar =
      index == parsedText.length - 1 &&
      parsedTargetText[index].tokenString.startsWith(element.tokenString);

    if (
      isNonMostRecentTypedTokenAndIsComplete ||
      isMostRecentTypedTokenAndIsCorrectSoFar
    ) {
      console.log("The typed text matches the target text, so far!");
      tokenInfosOfMatchingWords.push(element);
      // It doesn't matter that we're adding this element to the list of matching words before we've completed it (and therefore that we don't know if the user will type it correctly in full). Because it's a local variable, we recreate it each time.
    } else {
      const mismatchingPair = {
        typedToken: element,
        targetToken: parsedTargetText[index],
      };
      tokenInfosOfMismatchingWords.push(mismatchingPair);
    }
  }

  return {
    matches: tokenInfosOfMatchingWords,
    mismatchingPairs: tokenInfosOfMismatchingWords,
  };
}

function textContentFromHtmlString(htmlString) {
  const parser = new DOMParser();
  const miniDocument = parser.parseFromString(htmlString, "text/html");
  const textContent = miniDocument.body.textContent;

  return textContent;
}

export default function Typingbox({
  targetText,
  trainingTokens,
  currentTrial,
  setCurrentTrial,
  setPreviousSample,
}) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [typedTextWithHtml, setTypedTextWithHtml] = useState("");
  // By the way, something about the way setText works ignores/removes spans in the text. In order for spans to persist from rendering to rendering, a function needs to reapply them each time.
  const [isValid, setIsValid] = useState(true);

  /**
   * @type { [{startPosition: number | undefined, tokenSring: string }[]] }
   */

  const [mistypedTokensInfos, setMistypedTokensInfos] = useState([]);

  const typedTextContent = useMemo(
    () => textContentFromHtmlString(typedTextWithHtml),
    [typedTextWithHtml]
  );

  const [dateTimeStart, setDateTimeStart] = useState(null);
  const [dateTimeEnd, setDateTimeEnd] = useState(null);

  // This function captures the start time as soon as the user starts typing.
  useEffect(() => {
    if (dateTimeStart == null && typedTextContent) {
      setDateTimeStart(new Date().toISOString());
    }
  }, [dateTimeStart, typedTextContent]);

  // This function captures the start time the moment the user correctly completes the sample.
  useEffect(() => {
    if (dateTimeEnd == null && typedTextContent == targetText) {
      setDateTimeEnd(new Date().toISOString());
    }
  }, [dateTimeEnd, typedTextContent]);

  // This 👇 function compares the typedTextContent and the textToType. For the words where those two strings don't match, we're going to put a span, with a special class name, around the offending word in typedTextWithHtml

  // Note: Whenever we compare the text, we want to use a version of typedText that has stripped out the html, because otherwise we'll have problems. But whenever we set the text, we want to use raw text, with all the html, because that's the point of doing this fuction at all.

  useEffect(() => {
    const { mismatchingPairs } = compareTexts(targetText, typedTextContent);
    // CompareTexts returns an object of two arrays, one of tokenInfos and one of pairs of tokenInfos.

    if (mismatchingPairs.length > 0) {
      let annotatedText = typedTextContent;
      // this is intializing the annotatedText, which means we're starting with just the textContent.

      let correctiveFactor = 0;
      // There's a problem, which that every time we add a span to the text, that makes all of the startingPostitions that we're passing in inaccacurate. They're off by the number of charcaters that are added with the span.
      // We're manually correcting for this by adding the correctiveFactor to each starting and ending position.

      for (let index = 0; index < mismatchingPairs.length; index++) {
        // Looping through all of the mismatches.
        const { typedToken, targetToken } = mismatchingPairs[index];

        const startingPostition = typedToken.startPosition + correctiveFactor;

        const endingPosition =
          typedToken.startPosition +
          typedToken.tokenString.length +
          correctiveFactor;

        // This is where we're doing the actual replacement of a word by a word wrapped in a span. To do that, we're dividing the string into everything before the token, the token, and everything after the token, and then doing the substitution.

        const beforeToken = annotatedText.substring(0, startingPostition);
        const token = annotatedText.substring(
          startingPostition,
          endingPosition
        );
        const afterToken = annotatedText.substring(endingPosition);

        const newText =
          beforeToken +
          `<span class="missedToken">` +
          token +
          `</span>` +
          afterToken;

        annotatedText = newText;
        correctiveFactor = annotatedText.length - typedTextContent.length;

        // Grabbing the tokenInfos of mistyped words.
        // Every token of the targetText which is mistyped gets added to the mistypedTokenInfos, if and only if, that word in the target text (not the token, the specific instance of the token), hasn't been added already.

        setMistypedTokensInfos((mistypedTokensInfos) => {
          if (
            !mistypedTokensInfos.find((tokenInfo) => {
              return tokenInfo.startPosition == targetToken.startPosition;
            })
            // Future Eli, the thing that's happening here, is we're defining a function that is run on each element of mistypedTokenInfos. Each tokenInfo is passed in as an argument to the defined function, which returns a boolean.
          ) {
            return [...mistypedTokensInfos, targetToken];
          } else {
            return [...mistypedTokensInfos];
          }
        });
        // We're doing this with arrow syntax to insure that the mistypedTokensInfos is updated by the time we use in the setter function, and we don't run into async problems.
      }

      setTypedTextWithHtml(annotatedText);
    }
  }, [typedTextContent]);

  useEffect(() => {
    console.log("mistypedTokensInfos: ", mistypedTokensInfos);
  }, [mistypedTokensInfos]);

  async function submitSampleRunAndUpdateState() {
    if (dateTimeEnd) {
      const data = {
        trialData: currentTrial,
        dateTimeStart: dateTimeStart,
        dateTimeEnd: dateTimeEnd,
        targetText: targetText,
        trainingTokens: trainingTokens,
        missedWords: mistypedTokensInfos,
      };
      await sendCompletedSampleData(data);
      setPreviousSample(data);
      setCurrentTrial(null);
    }
  }

  async function submitSampleRunViaKeystroke(event) {
    if (event.key == "Enter") {
      submitSampleRunAndUpdateState();
    }
  }

  return (
    <div className="typingBox">
      <ContentEditable
        value={typedTextWithHtml}
        onKeyPress={submitSampleRunViaKeystroke}
        onChange={(newValue) => {
          setTypedTextWithHtml(newValue);
        }}
      />

      <button disabled={!dateTimeEnd} onClick={submitSampleRunAndUpdateState}>
        submit
      </button>
    </div>
  );
}
