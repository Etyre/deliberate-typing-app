import { useEffect, useState, useRef, useMemo } from "react";

export default function OptionsPanel() {
  return (
    <form>
      {/* Mode */}* Visual * Audio
      {/* Training Token Input */}* Free generation * Exclusivly train given
      words
      {/* Number of training tokens at a time */} * 1 * 2 * 3 * 4 * 5 * 6 * 7 *
      8 * 9 * 10
      {/* Select the training algorithm */}
      {/* Highlight training tokens */}* Don't highlight anything * Hightlight
      selected training tokens (* Highlight all tracked tokens over some
      threshold) * Highlight all tracked tokens
      {/* Color scheme */}
      {/* Remove add */}- link
      {/* Edit tracked tokens list */}- link
      {/* Upload sample text */}- link
    </form>
  );
}
