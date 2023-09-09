<script setup lang="ts">
import { onMounted,onUnmounted, ref } from "vue";
import{io,Socket} from "socket.io-client"
import{MouseInit} from "../Event/Mouse/index"
import{KeyBroadInit} from "../Event/KeyBroad/index"
let socket:Socket
let rtc:RTCPeerConnection
let _remoteStream:MediaStream
const vbtnShow=ref<boolean>(true)
const vplayer = ref<HTMLVideoElement>()
const vbtn=ref<HTMLButtonElement>()
const servers = {
			iceServers: [{
				urls: ["turn:asset.yz-rxrj.com?transport=udp"],
				credential: "admin",
				username :"123456",
				credentialType :"Password",
  }],
}
function test()
{
  initRTC()
  _remoteStream=new MediaStream();
  (vplayer.value as HTMLVideoElement).autoplay=true;
  (vplayer.value as HTMLVideoElement).srcObject =_remoteStream;
  vbtnShow.value=false
  document.oncontextmenu=function()//禁用鼠标右键
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
    rtc.setRemoteDescription(desc).then(() => {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            createAns()
					})
  })
  socket.on("ice",(data)=>
  {
    rtc.addIceCandidate(data);
  })
}
function initRTC()
{
  rtc = new RTCPeerConnection(servers);
    rtc.ontrack = (event) => {
      _remoteStream.addTrack(event.track);
			
			
		}
		//交换信令
		rtc.onicecandidate = (event) => {
			var candidate = event.candidate;
			if (candidate != null) {
				var data = {
					candidate: candidate.candidate,
					sdpMid: candidate.sdpMid,
					sdpMLineIndex: candidate.sdpMLineIndex
				};
				console.log(data)
			}
		}
		//文字消息交换
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
  rtc.createAnswer().then((res) => {
    rtc.setLocalDescription(res)
    socket.emit("answer",res.sdp)
		})
}
rtc=null

onMounted(() => {
    socket=io("http://127.0.0.1:3000",{auth:{type:"RSWeb"}})
    socket.on("connect", () => {
    console.log("链接上中央服务器"); // undefined
    socket.on("disconnect", () => 
    { console.log("与中央服务器链接断开"); // undefined
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
  background:url("/vite.svg") no-repeat;
  background-size: contain;
  background-position:center center;
  border: 0px;
}
</style>
