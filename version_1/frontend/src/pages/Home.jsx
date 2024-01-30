import Typingbox from "../components/Typingbox";
import TextToTypeBox from "../components/TextToTypeBox";

export default function Home () {
    return (<>
        <div className="textAndTypingContainer">  
            <TextToTypeBox></TextToTypeBox>
            <Typingbox></Typingbox> 
        </div>
        
    </>)
}