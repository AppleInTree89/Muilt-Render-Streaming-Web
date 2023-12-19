

let channel:RTCDataChannel;
const CheckActiveInit=(datachannel:RTCDataChannel) =>
{
    channel=datachannel;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            sentEvent(1,"");
        } else {
            sentEvent(0,"");
        }
    })
}

const sentEvent=(event:number,obj:string)=>
{
    var data={
        id:event,
        data:obj
    }
    if(channel.readyState=="open")
    channel.send(JSON.stringify(data))
}


export {CheckActiveInit}