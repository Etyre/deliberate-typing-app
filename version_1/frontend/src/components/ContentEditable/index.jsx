import { useState, useEffect, useRef } from "react";

function normalizeSpaces(text) {
  return text.replaceAll(String.fromCharCode(160), " ");
  // We're doing the replaceAll because the contentEditable div by default uses a different type of space from the standard text space (for trailing spaces only), and we need it to match textToType.
}

function getPositionInChildren(parentDiv, postionInParent) {
  let charactersLeft = postionInParent;

  for (let index = 0; index < parentDiv.childNodes.length; index++) {
    const currentNode = parentDiv.childNodes[index];
    if (charactersLeft <= currentNode.textContent.length) {
      return { node: currentNode, positionInNode: charactersLeft };
    }

    charactersLeft = charactersLeft - currentNode.textContent.length;

    // We expect that this won't work if any of the nodes have children themselves.
  }
}

export default function ContentEditable(props) {
  const theDivRef = useRef();

  console.log("props.value: ", `"${props.value}"`);

  const [startOffsetCopy, setStartOffsetCopy] = useState();
  const [endOffsetCopy, setEndOffsetCopy] = useState();

  const handleInput = (event) => {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    // console.log("Range start and end: ", range.startOffset, range.endOffset);
    setStartOffsetCopy(range.startOffset);
    setEndOffsetCopy(range.endOffset);

    // console.log("Range start and end: ", startOffsetCopy, endOffsetCopy);

    // props.onChange(normalizeSpaces(event.target.textContent));
    props.onChange(event.target.textContent);

    // Future Eli: It's maybe important that all three of setStartOffsetCopy, setEndOffsetCopy, and props.onChange happen in the same rerender, or things might break. If this code isn't working, check that.
  };

  useEffect(() => {
    // Come back and explain wha this code is doing!!

    if (!theDivRef.current) {
      return;
    }

    let selection = window.getSelection();
    if (!selection.rangeCount) {
      return;
    }
    let range = selection.getRangeAt(0);
    console.log("props.value: ", `"${props.value}"`);
    console.log("Range start and end: ", startOffsetCopy, endOffsetCopy);

    let newRange = range.cloneRange();
    newRange.setStart(
      theDivRef.current.childNodes[0] || theDivRef.current,
      startOffsetCopy
    );
    newRange.setEnd(
      theDivRef.current.childNodes[0] || theDivRef.current,
      endOffsetCopy
    );
    selection.removeAllRanges();
    selection.addRange(newRange);
  }, [props.value, theDivRef]);

  return (
    <div
      className="editableSection"
      contentEditable="true"
      onInput={handleInput}
      ref={theDivRef}
      dangerouslySetInnerHTML={{ __html: props.value }}
      //This line right here is just for the initial value, in case I want to pass in something other than the empty string.
    />
  );
}
