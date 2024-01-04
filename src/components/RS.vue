<script setup lang="ts">
import { onMounted,onUnmounted, ref } from "vue";
import{MouseInit} from "../Event/Mouse/index"
import{KeyBroadInit} from "../Event/KeyBroad/index"
import{MessageInit,sendMsg} from "../Event/Message/index"
let socket:WebSocket
let rtc:RTCPeerConnection|null
let mrtc:RTCPeerConnection|null
let _remoteStream:MediaStream
const vbtnShow=ref<boolean>(true)
const vplayer = ref<HTMLVideoElement>()
const vbtn=ref<HTMLButtonElement>()
function play()
{
  vbtnShow.value=false
  document.oncontextmenu=function()//Disabled menu
	{
		return false;
	}
    //@ts-ignore
  var url=window.ServerUrl as string
  console.log(url);
  //@ts-ignore
  socket=new WebSocket(window.ServerUrl as string)
  socket.onopen=()=>{console.log("链接成功") ;      _remoteStream=new MediaStream(); }
  socket.onclose=()=>{console.log("链接断开")}
  socket.onerror=()=>{console.log("链接错误")}
  socket.onmessage=(e)=>{
    console.log(e);
    var data =JSON.parse(e.data)
    console.log(e.data);
    switch (data.Event)
    {
      case "init":
      {
        sendMessage("init","")
        initRTC()
        break;
      }
      case "full":
      {
          alert("Not enough rendering resources please wait")
          socket.close();
          break;
      }
      case "offer":
      {
        const desc = new RTCSessionDescription({
						sdp: data.Data,
						type: "offer"});
            (rtc as RTCPeerConnection).setRemoteDescription(desc).then(() => {
            createAns()
					})
        break;
      }     
      case "ice":
      {
        
        (rtc as RTCPeerConnection).addIceCandidate( JSON.parse(data.Data));
        break;
      }
      case "moffer":
      {
        const desc = new RTCSessionDescription({
						sdp: data.Data,
						type: "offer"});
            (mrtc as RTCPeerConnection).setRemoteDescription(desc).then(() => {
              mcreateAns()
					})
        break;
      }     
      case "mice":
      {
        
        (mrtc as RTCPeerConnection).addIceCandidate( JSON.parse(data.Data));
        break;
      }
    }
    console.log(e)
  }
}

function initRTC()
{
  if(rtc!=null)
  {
    rtc.close()
    _remoteStream=new MediaStream();
    rtc=null
  }
  if(mrtc!=null)
  {
    mrtc.close()
    mrtc=null
  }
      // @ts-ignore 
  rtc = new RTCPeerConnection(window.rtcConfig as RTCConfiguration);
     // @ts-ignore 
  mrtc = new RTCPeerConnection(window.rtcConfig as RTCConfiguration);
    rtc.ontrack = (event) => {
      //@ts-ignore
      window.player=vplayer.value;
      _remoteStream.addTrack(event.track);
      console.log(vplayer.value);
        (vplayer.value as HTMLVideoElement).autoplay=true;
        (vplayer.value as HTMLVideoElement).srcObject =_remoteStream;
			
		}
		rtc.onicecandidate = (event) => {
			var candidate = event.candidate;
			if (candidate != null) {
				var data = {
					candidate: candidate.candidate,
					sdpMid: candidate.sdpMid,
					sdpMLineIndex: candidate.sdpMLineIndex
				};
        console.log(data)
				sendMessage("ice",JSON.stringify(data))
			}
		}
    //exchange signaling
		mrtc.onicecandidate = (event) => {
			var candidate = event.candidate;
			if (candidate != null) {
				var data = {
					candidate: candidate.candidate,
					sdpMid: candidate.sdpMid,
					sdpMLineIndex: candidate.sdpMLineIndex
				};
        console.log(data)
				sendMessage("mice",JSON.stringify(data))
			}
		}
    	//Text message exchange
		mrtc.ondatachannel = (event) => {
      if(event.channel.label=="message")
      {
        MessageInit(event.channel);
         //@ts-ignore
        window.send=sendMsg
      }
    }
		//Text message exchange
		rtc.ondatachannel = (event) => {
      if(event.channel.label=="mouse")
      {
        MouseInit(vplayer.value as HTMLVideoElement,event.channel)
      }
      if(event.channel.label=="key")
      {
        KeyBroadInit(vplayer.value as HTMLVideoElement,event.channel)
      }

  }
}
function createAns()
{
  (rtc as RTCPeerConnection).createAnswer().then((res) => {
    (rtc as RTCPeerConnection).setLocalDescription(res)
      sendMessage("answer",res.sdp as string)
		})
}
function mcreateAns()
{
  (mrtc as RTCPeerConnection).createAnswer().then((res) => {
    (mrtc as RTCPeerConnection).setLocalDescription(res)
      sendMessage("manswer",res.sdp as string)
		})
}
function sendMessage(Event:string,data:string)
{
  var message=
  {
    Event:Event,
    Data:data
  }
  socket.send(JSON.stringify(message))
}
      // @ts-ignore 

document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          sendMessage("DisConnect","")
        } else {
          sendMessage("Connect","")
        }
    })
onMounted(() => {

})
onUnmounted(() => {
  socket.close()
})

</script>

<template>

  <div id="player">
    <video ref="vplayer" id="tdVideo"></video>
    <audio id="tdAudio"></audio>
    
    <button ref="vbtn" v-show="vbtnShow" @click="play" id="playButton"></button>
  </div>
</template>

<style scoped>
body{
  margin: 0px;
  background-color: white;
}

#player{
  z-index: -1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  display: flex;
}

#tdVideo{
	z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#playButton{
  z-index: initial;
  width: 15vw;
  height: 15vw;
  max-width: 200px;
  max-height: 200px;
  background:url("/Play.png") no-repeat;
  background-size: contain;
  background-position:center center;
  border: 0px;
}
</style>
