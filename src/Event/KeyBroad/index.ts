import { Keymap } from "./keymap";
let channel:RTCDataChannel;
let input:HTMLInputElement;
let isLock:boolean=false;
let video:HTMLVideoElement;
const KeyBroadInit=(videoEle:HTMLVideoElement,datachannel:RTCDataChannel) =>
{
    video=videoEle
    channel=datachannel
    channel.onmessage=(e)=>
    {
        var data=JSON.parse(e.data);
        if(data["data"])
        {
        
            if(input==null)
            {
              
                input = document.createElement("input");
                input.type = "text";
                input.name = "input";
                input.style.position='absolute'
                input.style.overflow='hidden';
                document.body.appendChild(input);
                //@ts-ignore
                input.addEventListener("compositionstart",(e)=>{isLock=true})
                //@ts-ignore
                input.addEventListener("compositionend",(e)=>{isLock=false});
                //@ts-ignore
                input.style.width='10px'
                //@ts-ignore
                input.style.Height='10px'
                input.style.border="0"; 
                input.style.outline="none"; // 去除选中状态边框
                 //@ts-ignore
                input.style.color="rgba(0, 0, 0, 0)"// 透明背景
                input.style.background="none"// 透明背景
                //@ts-ignore
                //input.style.font.color="rgba(0, 0, 0, 0)"
                input.style.caretColor = "transparent";
                input.focus();
            }
            else
            {
                console.log("=============="+data["x"]+"  "+data["y"]);
                var pos= getInputPos(data["x"],data["y"],video)
                input.style.left=pos.x+'px';  // 指定创建的DIV在文档中距离左侧的位置
		        input.style.top=pos.y+'px';
                if(input.value!="")
                {
                    if(isLock==false)
                    {
                        //console.log("==============================="+input.value);
                        var value=
                        {   
                            id:2,
                            key:0,
                            data:input.value,
                            composition:""
                        }
                        sentEvent(JSON.stringify(value))
                        input.value="";
                    }
                    if(isLock==true)
                    {
                        //console.log("==============================="+input.value);
                        var value=
                        {   
                            id:2,
                            key:0,
                            data:"",
                            composition:input.value,
                        }
                        sentEvent(JSON.stringify(value))

                    }
                }
                input.focus();
            }
        }
        else
        {
            if(input!=null)
            {
                input.parentNode?.removeChild(input);
                //@ts-ignore
                input=null;
            }
        }
        //console.log("===============",e.data)
    }
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
const getInputPos=(inputx:number,inputy:number,video:HTMLVideoElement)=>
{
    if(inputx>1)
    {
        inputx=1
    }
    if(inputx<0)
    {
        inputx=0
    }
    if(inputy>1)
    {
        inputy=1
    }
    if(inputy<0)
    {
        inputy=0
    }
    let x:number
    let y:number
    var owidth= video.videoWidth;
    var oheight=video.videoHeight;
    var vwidth =video.clientWidth;
    var vheight=video.clientHeight;
    inputx=inputx;
    inputy=1-inputy;
    if(owidth/oheight>vwidth/vheight)
    {
        const scale=vwidth/owidth;
        const Height=oheight*scale;
        const upsize=(window.innerHeight-Height)/2

        x=inputx*window.innerWidth
        y=Height*inputy+upsize
    }
    else
    {
        //debugger
        const scale=vheight/oheight;
        const upsize=(1-scale)/2;
        x=(inputx*scale+upsize)*window.innerWidth;
        y=inputy*window.innerHeight;
    }
    if(isNaN(x)||isNaN(y))
    {
        var data={x:-1,y:-1};
        return data;
    }
    x=x-20;
    y=y-20;
    var data={x:x,y:y};
    return data;
}
export {KeyBroadInit}