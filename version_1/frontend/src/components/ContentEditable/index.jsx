import { useState, useEffect, useRef } from "react";

function normalizeSpaces(text) {
  return text.replaceAll(String.fromCharCode(160), " ");
  // We're doing the replaceAll because the contentEditable div by default uses a different type of space from the standard text space (for trailing spaces only), and we need it to match textToType.
}

function getPositionInChildren(parentDiv, postionInParent) {
  let charactersLeft = postionInParent;
  // console.log("postionInParent: ", postionInParent);

  if (parentDiv.childNodes.length == 0) {
    return { node: parentDiv, positionInNode: 0 };
  }
  // console.log("parentDiv.childNodes: ", parentDiv.childNodes);
  for (let index = 0; index < parentDiv.childNodes.length; index++) {
    /** @type {Node} */
    const currentNode = parentDiv.childNodes[index];
    let nodeToReturn;
    if (charactersLeft <= currentNode.textContent.length) {
      // TODO (Joe): Traverse all the way down to the correct node
      if (currentNode.nodeType != Node.TEXT_NODE) {
        nodeToReturn = currentNode.childNodes[0];
      } else {
        nodeToReturn = currentNode;
      }
      return { node: nodeToReturn, positionInNode: charactersLeft };
    }

    charactersLeft = charactersLeft - currentNode.textContent.length;
    // We expect that this won't work if any of the nodes have children themselves.
  }
}

// This function here 👇 computes the abolute position of the cursor (or the beginings and endings of a range), in the contentEditable section of the div.

function getPositionInParent(parentDiv, startingNode, positionRelativeToNode) {
  let totalPostition = positionRelativeToNode;

  let currentNode = startingNode;

  while (currentNode) {
    // This 👇 if statement only triggers if the cursor starts out inside of a span. In that case, it pops us up one level of the DOM tree, from the node inside of the span, to the span itself.
    // TODO (Joe): Traverse all the way up to the correct node
    currentNode =
      currentNode.previousSibling || currentNode.parentNode.previousSibling;

    if (
      !currentNode ||
      currentNode == parentDiv ||
      currentNode.contains(parentDiv)
    ) {
      break;
    }

    totalPostition += currentNode.textContent.length;
  }
  return totalPostition;
}

export default function ContentEditable(props) {
  const theDivRef = useRef();

  const [startOffsetCopy, setStartOffsetCopy] = useState();
  const [endOffsetCopy, setEndOffsetCopy] = useState();

  /**
   * @param {InputEvent} event
   */
  const handleInput = (event) => {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);

    // Selection stuff to save where the cursor is.
    // #region

    setStartOffsetCopy(
      getPositionInParent(
        theDivRef.current,
        range.startContainer,
        range.startOffset
      )
    );
    setEndOffsetCopy(
      getPositionInParent(
        theDivRef.current,
        range.endContainer,
        range.endOffset
      )
    );

    // #endregion

    // Updating the typedText state variable.
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
    // We're making a copy of the existing range, which we expect to be a cursor at the front of the contentEditable section. But we're only using to get a range to copy. We could in prinicple make a new one, but this seems safer for reasons I don't understand (according to Joseph).
    // The reason why it's safer, is that if we copy it and change all the parts that we need to be different, we know that all the parts that we didn't change will still be what we want.

    // console.log("props.value: ", `"${props.value}"`);
    // console.log("Range start and end: ", startOffsetCopy, endOffsetCopy);

    // translating from a global position in the div to the specific node and the postion in the that node.
    // console.log("startOffsetCopy: ", startOffsetCopy);
    const { node: nodeOfStart, positionInNode: postionInNodeOfStart } =
      getPositionInChildren(theDivRef.current, startOffsetCopy);

    // console.log("theDivRef.current :", theDivRef.current);
    // console.log("endOffsetCopy :", endOffsetCopy);

    const { node: nodeOfEnd, positionInNode: postionInNodeOfEnd } =
      getPositionInChildren(theDivRef.current, endOffsetCopy);

    let newRange = range.cloneRange();

    console.log("Setting range start...");
    console.log(
      "node: ",
      nodeOfStart || theDivRef.current,
      "offset: ",
      postionInNodeOfStart
    );
    newRange.setStart(nodeOfStart || theDivRef.current, postionInNodeOfStart);

    newRange.setEnd(nodeOfEnd || theDivRef.current, postionInNodeOfEnd);

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
