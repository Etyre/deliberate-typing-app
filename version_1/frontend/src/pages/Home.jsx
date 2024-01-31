import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";
import { useState } from "react";

export default function Home () {
    const [textToType, setTextToType] = useState("")

    return (
        <>
            <div className="textAndTypingContainer">  
                
                <TextToTypeBox></TextToTypeBox>
                <Typingbox textToType={textToType}></Typingbox> 
            </div>
        </>
    )
    }