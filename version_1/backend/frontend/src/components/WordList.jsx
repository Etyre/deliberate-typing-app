import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function WordList() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div>Please log in to manage your word list.</div>;
  }
  return (
    <div>
      <div>
        <label>
          Add a word:
          <div>
            <input type="text" />
            {/* Note, make this a bigger textbox */}
            <button>Add</button>
          </div>
        </label>
      </div>
      <div></div>
    </div>
  );
}
