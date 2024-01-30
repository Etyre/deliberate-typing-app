import {useState} from "react"


export default function TextToTypeBox () {

const [text, setText] = useState("")

function handleText(event) {
    setText(event.target.value)
}

return(
    <div className="textToTypeBox">
        <p>Test text.</p>
    </div>
)
}