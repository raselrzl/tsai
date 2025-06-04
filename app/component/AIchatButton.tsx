import { useState } from "react";
import AIchatBox from "./AIChatBox";
import { Button } from "@/components/ui/button";

export default function Aichatbutton(){
    const [chatBoxOpen, setChatBoxOpoen]=useState(false)

    return(
        <>
        <Button onClick={()=>setChatBoxOpoen(true)}>
            AI Chat
        </Button>
            <AIchatBox open={chatBoxOpen} onClose={()=>setChatBoxOpoen(false)}/>
        </>
    )
}