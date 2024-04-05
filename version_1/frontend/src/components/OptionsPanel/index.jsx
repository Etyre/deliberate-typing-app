import { useEffect, useState, useRef, useMemo } from "react";

export default function OptionsPanel() {
  return (
    <form className="settingPanel">
      <h1>Settings</h1>
      <div>
        <h3>Display Mode</h3>
        <p>Should the text to be typed be shown to you or read aloud to you?</p>
        <div>
          <label>
            <input type="radio" name="mode" /> Visual
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="mode" />
            Audio
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Training token sourcing</h3>
        <p>Where should the app get the words that you train on?</p>
        <div>
          <label>
            <input type="radio" name="mode" />
            All history (words that you've missed in the past)
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="mode" />
            Manual import (exclusively words that are listed below)
          </label>
          <div>
            <label>
              Training tokens:
              <div>
                <input type="text" />
                {/* Note, make this a bigger textbox */}
              </div>
            </label>
          </div>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Batch size</h3>
        <p>How many words do you want to train at once?</p>

        <div>
          <label>
            n = <input type="number" min="1" max="10" />
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Training Alogirthm</h3>
        <p>How should the app decide which words to train?</p>
        <div>
          <label>
            <input type="radio" name="algorithm" />
            Deliberate practice (continue serving a word until you get it
            correct 10 times in a row)
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="algorthim" />
            Current worst-scoring-first
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Token Highlighting</h3>
        <p>Which words should be highlighted, in the visual mode?</p>
        <div>
          <label>
            <input type="radio" name="hightlighting" />
            Current training tokens only
          </label>
        </div>

        <div>
          <label>
            <input type="radio" name="highlighting" />
            Any word that's ever been missed
          </label>
        </div>

        <div>
          <label>
            <input type="radio" name="highlighting" />
            Any word on which you have a smaller than n% all-time accuracy score
          </label>
          <div>
            n = <input type="text" />
          </div>
        </div>
        <div>
          <label>
            <input type="radio" name="hightlighting" />
            No highlight
          </label>
        </div>
      </div>
      <div>
        <h3>Add personalized text</h3>
        <p>
          Paste a document here that's characteristic of the kinds of things you
          often write. It will add those words to your token list, and you'll be
          tested on words like these more often.
        </p>
        <label>
          <input type="text"></input>
        </label>
      </div>

      {/*    Some settings to add:
       * choose color scheme
       * Remove ad
       * Edit tracked token list (should open a new view)
       * Upload sample text    */}
    </form>
  );
}
