import { useEffect, useState, useRef } from "react";
import ContentEditable from "../ContentEditable";

function typedTextParser(text) {
  let arrayOfWords = text.split(" ");
  // let arrayOfWords = text.split("");
  // Note: There are two ways, in principle, that we might want this to work. Either individual words are flagged as mistyped, but only after you "submit" them by hitting space. Or individual characters are flagged as wrong as soon as you type them. To do the second thing, I would need to build a bit of extra machinery, so that we're still able to log which whole words were mistyped, not just which characters. But this could be a setting, maybe.
  let arrayOfWordsWithSpaces = [];
  for (let index = 0; index < arrayOfWords.length; index++) {
    // We're adding a space to the end of each element, except for the last one.
    let element;
    if (index == arrayOfWords.length - 1) {
      element = arrayOfWords[index];
    } else {
      element = arrayOfWords[index] + " ";
    }
    arrayOfWordsWithSpaces.push(element);
  }
  return arrayOfWordsWithSpaces;
}

function compareTexts(targetText, text) {
  const parsedTargetText = typedTextParser(targetText);
  const parsedText = typedTextParser(text);

  for (let index = 0; index < parsedText.length; index++) {
    const element = parsedText[index];

    if (parsedTargetText[index].startsWith(element)) {
      console.log("The typed text matches the target text!");
    } else {
      console.log("Uh oh. The typed text differs from the target text.");
    }
  }
}

export default function Textbox({ textToType }) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);

  const [mistypedTokens, setMistypeTokens] = useState([]);

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
    if (text == "one two three") {
      setText("one <span>two</span> three");
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
