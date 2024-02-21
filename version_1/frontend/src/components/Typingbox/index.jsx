import { useEffect, useState, useRef, useMemo } from "react";
import ContentEditable from "../ContentEditable";

/**
 * @param {string} text
 */
function typedTextParser(text) {
  // let arrayOfWords = text.split(" ");
  // // let arrayOfWords = text.split("");
  // // Note: There are two ways, in principle, that we might want this to work. Either individual words are flagged as mistyped, but only after you "submit" them by hitting space. Or individual characters are flagged as wrong as soon as you type them. To do the second thing, I would need to build a bit of extra machinery, so that we're still able to log which whole words were mistyped, not just which characters. But this could be a setting, maybe.
  // let arrayOfWordsWithSpaces = [];
  // for (let index = 0; index < arrayOfWords.length; index++) {
  //   // We're adding a space to the end of each element, except for the last one.
  //   let element;
  //   if (index == arrayOfWords.length - 1) {
  //     element = arrayOfWords[index];
  //   } else {
  //     element = arrayOfWords[index] + " ";
  //   }
  //   arrayOfWordsWithSpaces.push(element);
  // }
  // return arrayOfWordsWithSpaces;

  const theWordAndPunctIterator = text.matchAll(/[\w']+|[^\w\s']/g);
  // this returns an iterator
  // It returns everything that's either a word or a punctuation mark.

  // const thePuncIterator = text.matchAll(/[^\w\s']/g);
  // This regex matches everything that's not a words, space or apostrophe.
  // this returns an iterator

  // console.log("The punctuation tokens as an array: ", [...thePuncIterator]);

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
  const parsedTargetText = typedTextParser(targetText);
  const parsedText = typedTextParser(text);

  let tokenInfosOfMatchingWords = [];
  let tokenInfosOfMismatchingWords = [];

  // console.log("The parsedTargetText", parsedTargetText);

  for (
    let index = 0;
    index < Math.max(parsedText.length, parsedTargetText.length);
    index++
  ) {
    const element = parsedText[index];
    // console.log("parsedTargetText[index]: ", parsedTargetText[index]);
    // console.log("element: ", element);

    if (!element || !parsedTargetText[index]) {
      break;
    }

    console.log(
      "parsedTargetText[index].tokenString: ",
      parsedTargetText[index].tokenString
    );

    console.log("element.tokenString: ", element.tokenString);

    if (parsedTargetText[index].tokenString.startsWith(element.tokenString)) {
      console.log("The typed text matches the target text, so far!");
      tokenInfosOfMatchingWords.push(element);
    } else {
      tokenInfosOfMismatchingWords.push(element);
    }
  }
  // console.log(
  //   "matches:",
  //   tokenInfosOfMatchingWords,
  //   "mismatches: ",
  //   tokenInfosOfMismatchingWords
  // );
  return {
    matches: tokenInfosOfMatchingWords,
    mismatches: tokenInfosOfMismatchingWords,
  };
}

function textContentFromHtmlString(htmlString) {
  const parser = new DOMParser();
  const miniDocument = parser.parseFromString(htmlString, "text/html");
  const textContent = miniDocument.body.textContent;

  return textContent;
}

export default function Typingbox({ textToType }) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [typedTextWithHtml, setTypedTextWithHtml] = useState("");
  // By the way, something about the way setText works ignores/removes spans in the text. In order for spans to persist from rendering to rendering, a function needs to reapply them each time.
  const [isValid, setIsValid] = useState(true);

  const [mistypedTokens, setMistypedTokens] = useState([]);

  const typedTextContent = useMemo(
    () => textContentFromHtmlString(typedTextWithHtml),
    [typedTextWithHtml]
  );

  // useEffect(() => {
  //   if (textToType.startsWith(typedTextContent)) {
  //     setIsValid(true);
  //   } else {
  //     setIsValid(false);
  //   }
  // }, [typedTextContent]);

  // This 👇 function compares the typedTextConent and the textToType. For the words where those two strings don't match, we're going to put a span, with a special class name, around the offending word in typedTextWithHtml

  // Note: Whenever we compare the text, we want to use a version of typedText that has stripped out the html, because otherwise we'll have problems. But whenever we set the text, we want to use raw text, with all the html, because that's the point of doing this fuction at all.

  useEffect(() => {
    const { mismatches } = compareTexts(textToType, typedTextContent);
    // CompareTexts returns an object of two arrays of tokenInfos

    // console.log("mismatches: ", mismatches);

    if (mismatches.length > 0) {
      let annotatedText = typedTextContent;
      // this is intializing the annotatedText, which means we're starting with just the textContent.

      let correctiveFactor = 0;
      // There's a problem, which that every time we add a span to the text, that makes all of the startingPostitions that we're passing in inaccacurate. They're off by the number of charcaters that are added with the span.
      // We're manually correcting for this by adding the correctiveFactor to each starting and ending position.

      for (let index = 0; index < mismatches.length; index++) {
        // Looping through all of the mismatches.
        const mismatch = mismatches[index];

        const startingPostition = mismatch.startPosition + correctiveFactor;

        const endingPosition =
          mismatch.startPosition +
          mismatch.tokenString.length +
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
      }
      setTypedTextWithHtml(annotatedText);
    }
  }, [typedTextContent]);

  return (
    <div className="typingBox">
      <ContentEditable
        value={typedTextWithHtml}
        onChange={(newValue) => {
          setTypedTextWithHtml(newValue);
        }}
      />
      {/* <textarea className={isValid==false? "redTextArea": ""} onChange={handleText} /> */}
      {/* <div onInput={handleText} className={"editableSection " + (isValid==false? "redTextArea": "")} dangerouslySetInnerHTML={{__html: text}} contentEditable="true">
                
            </div> */}
    </div>
  );
}
