import {useState} from "react"


export default function Textbox () {

const [text, setText] = useState("")

function handleText(event) {
    setText(event.target.value)
}

return(
    <div className="typingBox">
        <textarea onChange={handleText} />
    </div>
)
}