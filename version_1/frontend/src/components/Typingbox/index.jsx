import {useEffect, useState} from "react"


export default function Textbox ({textToType}) {
// An alternative way to write this line:
// export default function Textbox (props) 

const [text, setText] = useState("")
const [isValid, setIsValid] = useState(true)

useEffect(()=> {
    if(text == textToType){
        setIsValid(true)
    }else{
        setIsValid(false)
    }
}, [text])


function handleText(event) {
    setText(event.target.value)
}

return(
    <div className="typingBox">
        <textarea className={isValid==false? "redTextArea": ""} onChange={handleText} />
        <div className="editableSection" contentEditable="true">
            <p>Text text to see the div</p>
        </div>
    </div>
)
}