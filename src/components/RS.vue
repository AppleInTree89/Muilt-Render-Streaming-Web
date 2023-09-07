<script setup lang="ts">
import { onMounted,onUnmounted } from "vue";
import{io,Socket} from "socket.io-client"
let socket:Socket
let rtc:RTCPeerConnection
function AskForConnect()
{
  let op:RTCOfferOptions={};
  op.iceRestart=false;
  op.offerToReceiveAudio=true;
  op.offerToReceiveVideo=true
  //rtc.createDataChannel("11")
 // .protocol.rtc.addTrack
  rtc.createOffer(op).then(res=>{
    rtc.setLocalDescription(res)
    socket.emit("AskConnect",res.sdp)
  })
  rtc.onicecandidate= (event) => {
			var candidate = event.candidate;
      //console.log(candidate)
      if(candidate==null)
      {
        return
      }
      socket.emit("ice",{
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      })
	}
  rtc.onconnectionstatechange= () => {
    console.log(rtc.connectionState.toString())
  }

  rtc.ontrack=(event)=>
  {
    if(event.track.kind=="video")
			{
				console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvv")
				const _remoteStream:MediaStream=new MediaStream();
				_remoteStream.addTrack(event.track);
				  var video:HTMLVideoElement = document.getElementById("video") as HTMLVideoElement ;
         video.autoplay=true;
          video .srcObject =_remoteStream;
			}
		
  }

}
onMounted(() => {
    rtc=new RTCPeerConnection()
    socket=io("ws://127.0.0.1:3000",{auth:{type:"RSWeb"}})
    socket.on("connect", () => {
    console.log("链接上中央服务器"); // undefined
    socket.on("disconnect", () => 
    {
        console.log("与中央服务器链接断开"); // undefined
    });
    socket.on("answer", (data) => 
    {
      const desc = new RTCSessionDescription({
						sdp:data,
						type: "answer"
					});
          rtc.setRemoteDescription(desc)
    });
    socket.on("error", (data) => 
    {
       alert(data)// undefined
    });
    socket.on("wice",(data)=>
    {
      rtc.addIceCandidate(data)
      console.log(data)
    })

  });
})
onUnmounted(() => {
  socket.close()
})

</script>

<template>
  <button @click="AskForConnect">link</button>
  <video id="video"></video>
</template>

<style scoped>
.video
{
  width: 100%;
  height: 100%;
}
</style>
