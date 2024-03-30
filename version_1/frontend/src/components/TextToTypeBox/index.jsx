export default function TextToTypeBox({ textToType }) {
  function handleText(event) {
    setTextToType(event.target.value);
  }

  console.log("Text to Type: ", textToType);

  return (
    <div className="textToTypeBox">
      <p>{textToType}</p>
    </div>
  );
}
