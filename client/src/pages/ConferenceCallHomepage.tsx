import { socket } from '@/socket/socket';
import React, { useEffect, useState } from 'react'

const ConferenceCallHomepage = () => {
    const [roomId, setRoomId] = useState("");
    const [users, setUsers] = useState([])

    const handleRoomJoin = () => {
        socket.emit("join-room", {roomId, username: "hash"}, (response) =>{
            console.log(response)
        } )
        socket.emit("get-users", { roomId }, (users) => {
          console.log(users);
        });
    }

    useEffect(() => {
        socket.on("user-list", (users) => {
            console.log("users from list",users)
            setUsers(users)
        } )
    },[])


  return <div className="flex flex-col items-center justify-center gap-5 h-screen">
    <div className='flex gap-10'>
        <div>
            <input
        className="border-black-400 border-2"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button onClick={handleRoomJoin}>Join Room</button>
        </div>
        <div>{users.map((user) => (
            <p key={user.socketId}>{user.username} {" "} {user.socketId} </p>
        ))}</div>
    </div>

   
  </div>;
}

export default ConferenceCallHomepage
