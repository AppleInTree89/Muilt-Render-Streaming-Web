<script setup lang="ts">
import { onMounted,onUnmounted, ref } from "vue";
import{io,Socket} from "socket.io-client"
import{MouseInit} from "../Event/Mouse/index"
import{KeyBroadInit} from "../Event/KeyBroad/index"
let socket:Socket
let rtc:RTCPeerConnection|null
let _remoteStream:MediaStream
const vbtnShow=ref<boolean>(true)
const vplayer = ref<HTMLVideoElement>()
const vbtn=ref<HTMLButtonElement>()
function test()
{
  initRTC()
  _remoteStream=new MediaStream();
  (vplayer.value as HTMLVideoElement).autoplay=true;
  (vplayer.value as HTMLVideoElement).srcObject =_remoteStream;
  vbtnShow.value=false
  document.oncontextmenu=function()//Disabled menu
	{
		return false;
	}
  socket.emit("init",(response:any)=>
  {
    console.log(response)
    //vbtn.value?.style.visibility="hidden"
  })
  socket.on("offer",(data)=>
  {
    const desc = new RTCSessionDescription({
						sdp: data,
						type: "offer"});
    (rtc as RTCPeerConnection).setRemoteDescription(desc).then(() => {
            createAns()
					})
  })
  socket.on("ice",(data)=>
  {
    (rtc as RTCPeerConnection).addIceCandidate(data);
  })
}
function initRTC()
{
  if(rtc!=null)
  {
    rtc.close()
    rtc=null
  }
      // @ts-ignore 
  rtc = new RTCPeerConnection(window.rtcConfig as RTCConfiguration);
    rtc.ontrack = (event) => {
      _remoteStream.addTrack(event.track);
			
			
		}
		//exchange signaling
		rtc.onicecandidate = (event) => {
			var candidate = event.candidate;
			if (candidate != null) {
				var data = {
					candidate: candidate.candidate,
					sdpMid: candidate.sdpMid,
					sdpMLineIndex: candidate.sdpMLineIndex
				};
        console.log(data)
				socket.emit("ice",JSON.stringify(data))
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
        KeyBroadInit(event.channel)
      }
  }
}
function createAns()
{
  (rtc as RTCPeerConnection).createAnswer().then((res) => {
    (rtc as RTCPeerConnection).setLocalDescription(res)
    socket.emit("answer",res.sdp)
		})
}


onMounted(() => {
    // @ts-ignore 
    socket=io( window.ServerUrl as string,{auth:{type:"RSWeb"}})
    socket.on("connect", () => {
    console.log("Connect to central server"); // undefined
    socket.on("disconnect", () => 
    { console.log("Lost link to central server"); // undefined
    });
    socket.on("error",(e) => 
    { 
      alert(e)
    });
  });
})
onUnmounted(() => {
  socket.close()


})

</script>

<template>

  <div id="player">
    <video ref="vplayer" id="tdVideo"></video>
    <audio id="tdAudio"></audio>
    
    <button ref="vbtn" v-show="vbtnShow" @click="test" id="playButton"></button>
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
