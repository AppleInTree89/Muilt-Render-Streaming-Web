let channel:RTCDataChannel;
let video:HTMLVideoElement;
const MouseInit=(videoEle:HTMLVideoElement,datachannel:RTCDataChannel) =>
{
    channel=datachannel;
    video=videoEle;
    channel.onmessage=(e)=>
    {
       
        if(e.data=="1")
        {
            video.focus();
            video.requestPointerLock();
        }
        else
        {
            
            document.exitPointerLock();
            //video.blur()
        
        }
       
    }
    //鼠标移动
    video.onmousemove=function(event)
    {
        var data= getMousePos(event.offsetX,event.offsetY,video);
        var movedata= getmovePos(event.movementX,event.movementY,video);
        if(data.x>0&&data.y>0&&data.x<video.videoWidth&&data.y<video.videoHeight)
        {
            var value=
            {   
                id:0,
                delayX:movedata.x,
                delayY:movedata.y,
                x:data.x,
                y:data.y,
                LockState:document.pointerLockElement===video
            }
            sentEvent(JSON.stringify(value))
        }
    }
    //鼠标按下
    video.onmousedown=function(event)
    {
        var value=
        {   
            id:1,
            buttonid:event.buttons,
            LockState:document.pointerLockElement===video
        }
        sentEvent(JSON.stringify(value))
    }
    
    video.onmouseup=function(event)
    {
        var value=
        {   
            id:1,
            buttonid:event.buttons,
            LockState:document.pointerLockElement===video
        }
        sentEvent(JSON.stringify(value))
    }

    window.onwheel=function(e)
    {
        var value=
        {   
            id:2,
            ScrollX:e.deltaX,
            ScrollY:e.deltaY*1.2,
            LockState:document.pointerLockElement===video
        }
        sentEvent(JSON.stringify(value))
    }
 
}
const sentEvent=(data:string)=>
{
    
    if(channel.readyState=="open")
    channel.send(data)
}

const getMousePos=(offsetx:number,offsety:number,video:HTMLVideoElement)=>
{
    let x:number
    let y:number
     var owidth= video.videoWidth;
    var oheight=video.videoHeight;
    var vwidth =video.clientWidth;
    var vheight=video.clientHeight;
    if(owidth/oheight>vwidth/vheight)
    {
        const scale=vwidth/owidth;
        const upsize=(vheight-(oheight*scale))/2;
        x=Math.round(offsetx/scale);
        y=oheight-Math.round((offsety-upsize)/scale);
    }
    else
    {
        const scale=vheight/oheight;
        const upsize=(vwidth-(owidth*scale))/2;
        x=Math.round((offsetx-upsize)/scale);
        y=oheight-Math.round(offsety/scale);
    }
    if(isNaN(x)||isNaN(y)||x<0||y<0||x>owidth||y>oheight)
    {
        var data={x:-1,y:-1};
        return data;
    }
    var data={x:x,y:y};
    return data;
}
const getmovePos=(offsetx:number,offsety:number,video:HTMLVideoElement)=>
{
    let x:number
    let y:number
    var owidth= video.videoWidth;
    var oheight=video.videoHeight;
    var vwidth =video.clientWidth;
    var vheight=video.clientHeight;
    if(owidth/oheight>vwidth/vheight)
    {
        const scale=vwidth/owidth;
        x=Math.round(offsetx/scale);
        y=-Math.round((offsety)/scale);
    }
    else
    {
        const scale=vheight/oheight;
        //@ts-ignore
        const upsize=(vwidth-(owidth*scale))/2;
        x=Math.round(offsetx/scale);
        y=-Math.round((offsety)/scale);
    }
   
    var data={x:x,y:y};
    return data;
}
export {MouseInit}