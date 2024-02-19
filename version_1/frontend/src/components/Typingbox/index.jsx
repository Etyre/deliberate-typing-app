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

  const theWordIterator = text.matchAll(/[\w']+/g);
  // this returns an iterator

  const thePuncIterator = text.matchAll(/[^\w\s']/g);
  // This regex matches everything that's not a words, space or apostrophe.
  // this returns an iterator

  // console.log("The punctuation tokens as an array: ", [...thePuncIterator]);

  const arrayOfRegexMatches = [...thePuncIterator, ...theWordIterator];
  // This is an array of arrays.

  // Note that the punctuation marks are all at the front, instead of in order between the words. This is fine, we're putting them back in order later, but don't get confused about it.

  // Elements: 0th: the matched string
  // The postition of the first charcater is the the .index property of the array. (These arrays have an index property)
  // To find out more read documentation on RegExpMatchArray

  const arrayOfTokenInfos = arrayOfRegexMatches.map((element) => ({
    firstCharacterPostition: element.index,
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

    if (parsedTargetText[index].tokenString.startsWith(element.tokenString)) {
      console.log("The typed text matches the target text, so far!");
      tokenInfosOfMatchingWords.push(element);
    } else {
      tokenInfosOfMismatchingWords.push(element);
    }
  }
  return {
    matchingWordInstances: tokenInfosOfMatchingWords,
    mismatchingWordInstances: tokenInfosOfMismatchingWords,
  };
}

function textContentFromHtmlString(htmlString) {
  const parser = new DOMParser();
  const miniDocument = parser.parseFromString(htmlString, "text/html");
  const textContent = miniDocument.body.textContent;

  return textContent;
}

export default function Textbox({ textToType }) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [typedTextWithHtml, setTypedTextWithHtml] = useState(
    "one two three four five six seven eight"
  );
  // By the way, something about the way setText works ignores/removes spans in the text. In order for spans to persist from rendering to rendering, a function needs to reapply them each time.
  const [isValid, setIsValid] = useState(true);

  const [mistypedTokens, setMistypedTokens] = useState([]);

  const typedTextContent = useMemo(
    () => textContentFromHtmlString(typedTextWithHtml),
    [typedTextWithHtml]
  );

  useEffect(() => {
    // console.log("textToType is: ", textToType);
    // console.log("text is: ", `"${typedTextWithHtml}"`);

    if (textToType.startsWith(typedTextContent)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [typedTextContent]);

  useEffect(() => {
    compareTexts(textToType, typedTextContent);
  }, [textToType, typedTextContent]);

  useEffect(() => {
    // Whenever we compare the text, we want to use a version of typedText that has stripped out the html, because otherwise we'll problems.
    // But whenever we set the text, we want to use raw text, with all the html, because that's the point of doing this fuction at all.

    const matchesAndMismatches = compareTexts(textToType, typedTextContent);
    // CompareTexts returns an object of two arrays of tokenInfos
    const parsedText = typedTextParser(typedTextContent);
    const reconstructedText = "";

    if (matchesAndMismatches.mismatchingWordInstances.length == 0) {
      setTypedTextWithHtml(typedTextWithHtml);
    } else {
      let annotatedText = typedTextContent;
      // this is intializing the annotatedText, which means we're starting with just the textContent.

      let additiveCorrectionFactor = 0;
      // There's a problem, which that every time we add a span to the text, that makes all of the startingPostitions that we're passing in inaccacurate. They're off by the number of charcaters that are added with the span.
      // We're manually correcting for this by adding the correctiveFactor to each starting and ending position.

      for (
        let index = 0;
        index < matchesAndMismatches.mismatchingWordInstances.length;
        index++
      ) {
        const element = matchesAndMismatches.mismatchingWordInstances[index];

        const startingPostition =
          matchesAndMismatches.mismatchingWordInstances[index]
            .firstCharacterPostition + additiveCorrectionFactor;

        const endingPosition =
          matchesAndMismatches.mismatchingWordInstances[index]
            .firstCharacterPostition +
          matchesAndMismatches.mismatchingWordInstances[index].tokenString
            .length +
          additiveCorrectionFactor;

        const beforeToken = annotatedText.substring(0, startingPostition);
        // console.log("beforeToken: ", beforeToken);
        const token = annotatedText.substring(
          startingPostition,
          endingPosition
        );
        // console.log("token :", token);
        const afterToken = annotatedText.substring(endingPosition);
        // console.log("afterToken :", afterToken);

        const newText =
          beforeToken +
          `<span class="missedToken">` +
          token +
          `</span>` +
          afterToken;

        // console.log(annotatedText);
        // console.log(additiveCorrectionFactor);

        annotatedText = newText;
        additiveCorrectionFactor =
          annotatedText.length - typedTextContent.length;
      }
      // console.log(annotatedText);
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
