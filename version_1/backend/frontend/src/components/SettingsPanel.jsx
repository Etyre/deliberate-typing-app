import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { saveSettings } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";

/**
 *
 * @param {{currentTrialSettings: {
 * trialDisplayMode:  "VISUAL" | "AUDIO",
 * trainingTokenSourcing: "ALL_TRACKED_TOKENS" | "MANUAL_LIST",
 * batchSize: number,
 * trainingAlgorithm: "DELIBERATE_PRACTICE" | "DELIBERATE_PRACTICE_PRIORIZING_LAPSED_WORDS" | "STRICT_WORST_SCORING_FIRST",
 * tokenHighlighting: "CURRENT_TRAINING_TOKENS" | "ALL_TRACKED_TOKENS" | "TRACKED_TOKENS_ABOVE_THRESHOLD" |"NO_HIGHLIGHTING",
 * tokenHighlightingThreshold: number | null}}} props
 */

export default function OptionsPanel() {
  const { settings } = useContext(AuthContext);

  const [formSettings, setFormSettings] = useState({ ...settings });

  useEffect(() => {
    if (!formSettings) {
      return;
    }
    saveSettings(formSettings);
  }, [
    formSettings.trialDisplayMode,
    formSettings.trainingTokenSourcing,
    formSettings.batchSize,
    formSettings.trainingAlgorithm,
    formSettings.tokenHighlighting,
    formSettings.tokenHighlightingThreshold,
  ]);

  return (
    <form className="settingsPanel">
      <h2>Settings</h2>
      <div>
        <h3>Display Mode [not yet functional]</h3>
        <p>Should the text to be typed be shown to you or read aloud to you?</p>
        <div>
          <label>
            <input
              type="radio"
              name="displayMode"
              value={"VISUAL"}
              checked={formSettings.trialDisplayMode == "VISUAL"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trialDisplayMode: newValue,
                }));
              }}
            />
            Visual
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="displayMode"
              value={"AUDIO"}
              checked={formSettings.trialDisplayMode == "AUDIO"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trialDisplayMode: newValue,
                }));
              }}
            />
            Audio
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Training token sourcing [not yet functional]</h3>
        <p>Where should the app get the words that you train on?</p>
        <div>
          <label>
            <input
              type="radio"
              name="trainingTokenSourcing"
              value={"ALL_TRACKED_TOKENS"}
              checked={
                formSettings.trainingTokenSourcing == "ALL_TRACKED_TOKENS"
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trainingTokenSourcing: newValue,
                }));
              }}
            />
            All history (words that you've missed in the past, from any source)
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="trainingTokenSourcing"
              value={"MANUAL_LIST"}
              checked={formSettings.trainingTokenSourcing == "MANUAL_LIST"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trainingTokenSourcing: newValue,
                }));
              }}
            />
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
            n ={" "}
            <input
              type="number"
              min="1"
              max="10"
              value={formSettings.batchSize}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  batchSize: newValue,
                }));
              }}
            />
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Training Alogirthm [not yet functional]</h3>
        <p>How should the app decide which words to train?</p>
        <div>
          <label>
            <input
              type="radio"
              name="algorithm"
              value={"DELIBERATE_PRACTICE"}
              checked={formSettings.trainingAlgorithm == "DELIBERATE_PRACTICE"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trainingAlgorithm: newValue,
                }));
              }}
            />
            Deliberate practice (Continue serving a word until you get it
            correct 10 times in a row.)
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="algorithm"
              value={"DELIBERATE_PRACTICE_PRIORIZING_LAPSED_WORDS"}
              checked={
                formSettings.trainingAlgorithm ==
                "DELIBERATE_PRACTICE_PRIORIZING_LAPSED_WORDS"
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trainingAlgorithm: newValue,
                }));
              }}
            />
            Deliberate practice, prioritizing lapsed words (Continue serving a
            word until you get it correct 10 times in a row. If you miss it
            again, relearning is prioritized over new words.)
          </label>
        </div>
        {/* <div>
          <label>
            <input type="radio" name="algorithm" />
            Deliberate practice with spaced repetition (Continue serving a word
            until you get it correct 10 times in a row, then serve that word on
            a spaced repetition schedule)
          </label>
        </div> */}
        <div>
          <label>
            <input
              type="radio"
              name="algorthim"
              value={"STRICT_WORST_SCORING_FIRST"}
              checked={
                formSettings.trainingAlgorithm == "STRICT_WORST_SCORING_FIRST"
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  trainingAlgorithm: newValue,
                }));
              }}
            />
            Current worst-scoring-first (Serve the top words that you've missed
            most frequently, per times they've come up.)
          </label>
        </div>
      </div>
      {/*  */}
      <div>
        <h3>Token Highlighting [not yet functional]</h3>
        <p>Which words should be highlighted, in the visual mode?</p>
        <div>
          <label>
            <input
              type="radio"
              name="hightlighting"
              value={"CURRENT_TRAINING_TOKENS"}
              checked={
                formSettings.tokenHighlighting == "CURRENT_TRAINING_TOKENS"
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  tokenHighlighting: newValue,
                }));
              }}
            />
            Current training tokens only
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="highlighting"
              value={"ALL_TRACKED_TOKENS"}
              checked={formSettings.tokenHighlighting == "ALL_TRACKED_TOKENS"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  tokenHighlighting: newValue,
                }));
              }}
            />
            Any word that's ever been missed
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="highlighting"
              value={"TRACKED_TOKENS_ABOVE_THRESHOLD"}
              checked={
                formSettings.tokenHighlighting ==
                "TRACKED_TOKENS_ABOVE_THRESHOLD"
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  tokenHighlighting: newValue,
                }));
              }}
            />
            Any word on which you have a smaller than n% all-time accuracy score
            (plus current training words)
          </label>
          <div>
            n = <input type="text" />
          </div>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="hightlighting"
              value={"NO_HIGHLIGHTING"}
              checked={formSettings.tokenHighlighting == "NO_HIGHLIGHTING"}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormSettings((formSettings) => ({
                  ...formSettings,
                  tokenHighlighting: newValue,
                }));
              }}
            />
            No highlight
          </label>
        </div>
      </div>
      <div>
        <h3>Add personalized text [not yet functional]</h3>
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
