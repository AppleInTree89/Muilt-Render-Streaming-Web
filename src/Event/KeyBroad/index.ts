import { Keymap } from "./keymap";
let channel:RTCDataChannel;
const KeyBroadInit=(datachannel:RTCDataChannel) =>
{
    channel=datachannel
    window.onkeydown=function(event:KeyboardEvent)
    {
        let code:string= event.code;
        var data=(Keymap as any)[code] ;
        var value=
        {   
            id:0,
            key:data,
        }
        sentEvent(JSON.stringify(value))
    }
    window.onkeyup=function(event:KeyboardEvent)
    {
        let code:string= event.code;
        var data=(Keymap as any)[code] ;
        var value=
        {   
            id:1,
            key:data,
        }
        sentEvent(JSON.stringify(value))
    }
   
}
const sentEvent=(data:string)=>
{
    
    if(channel.readyState=="open")
    channel.send(data)
}
export {KeyBroadInit}