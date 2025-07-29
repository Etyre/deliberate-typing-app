import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { addWordToWordList } from "../api/api";

export default function WordList() {
  const { currentUser, isAnonUser } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");

  const handleAddWord = async () => {
    try {
      await addWordToWordList({ word: inputValue });
      setInputValue("");
    } catch (error) {
      console.error("failed to add word to word list");
    }
  };

  if (isAnonUser) {
    return <div>Please log in to manage your word list.</div>;
  }
  return (
    <div>
      <div>
        <label>
          Add a word:
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* Note, make this a bigger textbox */}
            <button onClick={handleAddWord}>Add</button>
          </div>
        </label>
      </div>
      <div></div>
    </div>
  );
}
