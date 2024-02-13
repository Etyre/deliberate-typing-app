import { useEffect, useState, useRef } from "react";
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

  const theIterator = text.matchAll(/[\w']+/g)
  // this returns an iterator
  const arrayOfRegexMatches = [...theIterator];
  // This is an array of arrays.
  // Elements: 0th: the matched string
  // The postition of the first charcater is the the .index property of the array. (These arrays have an index property)
  // To find out more read documentation on RegExpMatchArray

  return arrayOfRegexMatches

}

function compareTexts(targetText, text) {
  const parsedTargetText = typedTextParser(targetText);
  const parsedText = typedTextParser(text);

  for (let index = 0; index < parsedText.length; index++) {
    const element = parsedText[index];

    let tuplesOfMatchingWords = [];
    let tuplesOfMismatchingWords = [];

    if (parsedTargetText[index].startsWith(element)) {
      console.log("The typed text matches the target text, so far!");
      tuplesOfMatchingWords.push({
        index: index,
        startPosition: ,
        text: parsedTargetText[index],
      });
    } else {
      console.log(
        "Uh oh. The some of typed text differs from the target text."
      );
      tuplesOfMismatchingWords.push({
        index: index,
        text: parsedTargetText[index],
      });
    }
    return {
      matchingWordInstances: tuplesOfMatchingWords,
      mismatchingWordInstances: tuplesOfMismatchingWords,
    };
  }
}

export default function Textbox({ textToType }) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [text, setText] = useState(
    "one <span>two</span> three four five <span>six</span> <span>seven</span> eight"
  );
  // By the way, something about the way set text works ignores/removes spans in the text. In order for spans to persist from rendering to rendering, a function needs to reapply them each time.
  const [isValid, setIsValid] = useState(true);

  const [mistypedTokens, setMistypedTokens] = useState([]);

  useEffect(() => {
    console.log("textToType is: ", textToType);
    console.log("text is: ", `"${text}"`);

    // if()

    if (textToType.startsWith(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [text]);

  useEffect(() => {
    compareTexts(textToType, text);
  }, [textToType, text]);

  useEffect(() => {
    matchesAndMismatches = compareTexts(textToType, text)
    parsedText = typedTextParser(text)
    reconstructedText = ""

    if (matchesAndMismatches.mismatchingWordInstances.length==0) {
      setText(text);
    }else{
      
    }

  }, [text]);

  return (
    <div className="typingBox">
      <ContentEditable
        value={text}
        onChange={(newValue) => {
          setText(newValue);
        }}
      />
      {/* <textarea className={isValid==false? "redTextArea": ""} onChange={handleText} /> */}
      {/* <div onInput={handleText} className={"editableSection " + (isValid==false? "redTextArea": "")} dangerouslySetInnerHTML={{__html: text}} contentEditable="true">
                
            </div> */}
    </div>
  );
}
