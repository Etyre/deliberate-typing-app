
export default function TextToTypeBox ({textToType}) {

function handleText(event) {
    setTextToType(event.target.value)
}

return(
    <div className="textToTypeBox">
        <p>{textToType}</p>
    </div>
)
}