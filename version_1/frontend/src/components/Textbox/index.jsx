import {useState} from "react"


export default function Textbox () {

const [text, setText] = useState("")

function handleText(event) {
    setText(event.target.value)
}

return(
    <div>
        <input type="text" onChange={handleText} />
    </div>
)
}