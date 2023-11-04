let channel:RTCDataChannel;
const MouseInit=(video:HTMLVideoElement,datachannel:RTCDataChannel) =>
{
    channel=datachannel;

    //鼠标移动
    video.onmousemove=function(event)
    {
        var data= getMousePos(event.offsetX,event.offsetY,video);
        if(data.x>0&&data.y>0&&data.x<video.videoWidth&&data.y<video.videoHeight)
        {
            var value=
            {
                x:data.x,
                y:data.y,
            }
            sentEvent(0,JSON.stringify(value))
        }
        
    }
    //鼠标按下
    video.onmousedown=function(event)
    {
        console.log(event.button)
        if(event.button==0)
        {
            sentEvent(1,"0")
        }
        if(event.button==1)
        {
            sentEvent(1,"2")
        }
        if(event.button==2)
        {
            sentEvent(1,"1")
        }
    }
    
    video.onmouseup=function(event)
    {
        console.log(event.button)
        if(event.button==0)
        {
            sentEvent(2,"0")
        }
        if(event.button==1)
        {
            sentEvent(2,"2")
        }
        if(event.button==2)
        {
            sentEvent(2,"1")
        }
    }
    window.onwheel=function(e)
    {
        if(e.deltaY>0)
         sentEvent(3,"1")
        else
         sentEvent(3,"-1")
        console.log(e.deltaY)
    }
    window.onblur = function() {
        sentEvent(4,"0")
    }
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
export {MouseInit}