import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { addWordToWordList, getWordList } from "../api/api";

function isValidWord(word) {
  const trimmedWord = word.trim();
  
  if (!trimmedWord) return false;
  
  const validWordPattern = /^[\w'-]+$/;
  return validWordPattern.test(trimmedWord);
}

export default function WordList() {
  const { currentUser, isAnonUser } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWordList = async () => {
    try {
      setLoading(true);
      const data = await getWordList();
      setTrackedTokens(data.trackedTokens);
    } catch (error) {
      console.error("Failed to fetch word list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAnonUser) {
      fetchWordList();
    }
  }, [isAnonUser]);

  const handleAddWord = async () => {
    if (!isValidWord(inputValue)) {
      setErrorMessage("Word can only contain letters, numbers, hyphens, and apostrophes. No spaces or other punctuation.");
      return;
    }

    try {
      await addWordToWordList({ word: inputValue.trim() });
      setInputValue("");
      setErrorMessage("");
      await fetchWordList(); // Refresh the list
    } catch (error) {
      console.error("failed to add word to word list");
      setErrorMessage("Failed to add word to word list.");
    }
  };

  const filteredTokens = trackedTokens.filter(token => {
    if (filterType === "all") return true;
    if (filterType === "manual") return token.tokenSource === "ADDED_MANUALLY" || token.tokenSource === "BOTH_MISSED_AND_ADDED_MANUALLY";
    if (filterType === "missed") return token.tokenSource === "MISSED_IN_PRACTICE" || token.tokenSource === "BOTH_MISSED_AND_ADDED_MANUALLY";
    return true;
  });

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
          {errorMessage && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errorMessage}
            </div>
          )}
        </label>
      </div>
      <div>
        <h2>Your word list</h2>
        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input 
              type="radio" 
              name="word-list-filter" 
              value="all"
              checked={filterType === "all"}
              onChange={(e) => setFilterType(e.target.value)}
            />
            All words
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input 
              type="radio" 
              name="word-list-filter" 
              value="manual"
              checked={filterType === "manual"}
              onChange={(e) => setFilterType(e.target.value)}
            />
            Manually added only
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input 
              type="radio" 
              name="word-list-filter" 
              value="missed"
              checked={filterType === "missed"}
              onChange={(e) => setFilterType(e.target.value)}
            />
            Missed words only
          </label>
        </div>
        
        {loading ? (
          <div>Loading word list...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Word</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token) => (
                <tr key={token.tokenId} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{token.tokenString}</td>
                  <td style={{ padding: "8px" }}>{token.status}</td>
                  <td style={{ padding: "8px" }}>
                    {(token.accuracy * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {filteredTokens.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: "8px", textAlign: "center", fontStyle: "italic" }}>
                    No words found for selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
