
let channel:RTCDataChannel;
const MessageInit=(datachannel:RTCDataChannel) =>
{
    channel=datachannel;
    channel.onmessage=(e)=>
    {
        console.log("===============",e)
    }
  
}
const sendMsg=function(message:string)
{
    if(channel.readyState=="open")
    channel.send(message)
    else
    console.log("消息发送失败")
}
export {MessageInit,sendMsg}