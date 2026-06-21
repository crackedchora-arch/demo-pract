import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { socket } from "@/socket/socket";
const VideoCallHomepage = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [roomId, setRoomId] = useState("");

  const initMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }

    // peer config
    const peer = new Peer();

    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Peer ID:", id);
    });

    peer.on("call", (call) => {
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    });
  };

  const handleRoomJoin = () => {
    if (!peerRef.current) return;
    socket.emit("join-room", { roomId, peerId: peerRef.current.id });

    socket.on("user-connected", (peerId) => {
      console.log("user peer id", peerId);
      connectToNewUser(peerId);
    });
  };

  const connectToNewUser = (userPeerId) => {
    if (!peerRef.current || !streamRef.current) return;
    const call = peerRef.current.call(userPeerId, streamRef.current);
    console.log("Calling:", userPeerId);
    call?.on("stream", (remoteStream) => {
      // console.log(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
  };

  useEffect(() => {
    initMedia();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-screen">
      <div>
        <input
          className="border-black-400 border-2"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button onClick={handleRoomJoin}>Join Room</button>
      </div>

      <video className="h-80" ref={myVideoRef} autoPlay muted playsInline />
      <video className="h-80" ref={remoteVideoRef} autoPlay muted playsInline />
    </div>
  );
};

export default VideoCallHomepage;
