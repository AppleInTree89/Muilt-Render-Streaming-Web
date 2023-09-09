import { Keymap } from "./keymap";
let channel:RTCDataChannel;
const KeyBroadInit=(video:HTMLVideoElement,datachannel:RTCDataChannel) =>
{
    channel=datachannel
    window.onkeydown=function(event:KeyboardEvent)
    {
        let code:string= event.code;
        var data:number=(Keymap as any)[code] ;
        sentEvent(0,data)
    }
    window.onkeyup=function(event:KeyboardEvent)
    {
        let code:string= event.code;
        var data:number=(Keymap as any)[code] ;
        sentEvent(1,data)
    }
    window.onblur = function() {
        sentEvent(2,0)
    }
}
const sentEvent=(event:number,obj:number)=>
{
    console.log(obj)
    var data={
        id:event,
        data:obj
    }
    if(channel.readyState=="open")
    channel.send(JSON.stringify(data))
}
export {KeyBroadInit}