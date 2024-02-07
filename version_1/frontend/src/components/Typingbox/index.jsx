import { useEffect, useState, useRef } from "react";

function typedTextParser(text) {
  arrayOfWords = text.split(" ");
  arrayOfWordsWithSpaces = [];
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

function ContentEditableWithRef(props) {
  const defaultValue = useRef(props.value);

  const handleInput = (event) => {
    props.onChange(event.target.innerHTML);
  };

  return (
    <div
      className="editableSection"
      contentEditable="true"
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
      //This line right here is just for the initial value, in case I want to pass in something other than the empty string.
    />
  );
}

export default function Textbox({ textToType }) {
  // An alternative way to write this line:
  // export default function Textbox (props)

  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);

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

  function handleText(event) {
    setText(event.target.textContent.replaceAll(String.fromCharCode(160), " "));
    // We're doing the replaceAll because the contentEditable div by default uses a different type of space from the standard text space (for trailing spaces only), and we need it to match textToType.
  }

  return (
    <div className="typingBox">
      <ContentEditableWithRef
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
