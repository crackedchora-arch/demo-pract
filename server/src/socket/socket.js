import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
  },
});

// io.on("connection", (socket) => {
//   socket.on("join-room", ({ roomId, peerId }) => {
//     socket.join(roomId);
//     socket.to(roomId).emit("user-connected", peerId);
//   });
// });
const rooms = new Map();

/*
rooms = {
  roomId: {
    users: Map(socketId => {
      socketId,
      username
    })
  }
}
*/

io.on("connection", (socket) => {
   console.log("Connected:", socket.id);

   socket.on("join-room", ({roomId, username}, callback) => {
    if(!rooms.has(roomId)){
      rooms.set(roomId, {
        users: new Map()
      })
    }

    const room = rooms.get(roomId)

    room.users.set(socket.id, {
      socketId: socket.id,
      username
    })

    socket.join(roomId)

    const users = [...room.users.values()];
    io.to(roomId).emit("user-list", users);

   })

   socket.on("leave-room", ({ roomId }) => {
   const room = rooms.get(roomId);

   if (!room) return;

   room.users.delete(socket.id);

   socket.leave(roomId);

   const users = [...room.users.values()];

   io.to(roomId).emit("user-list", users);

   if (room.users.size === 0) {
     rooms.delete(roomId);
   }
});
   
socket.on("get-users", ({ roomId }, callback) => {
  const room = rooms.get(roomId);

  if (!room) {
    return callback([]);
  }

  callback([...room.users.values()]);
});

   socket.on("disconnect", () => {
     for (const [roomId, room] of rooms.entries()) {
    if (room.users.has(socket.id)) {
      room.users.delete(socket.id);

      io.to(roomId).emit(
        "user-list",
        [...room.users.values()]
      );

      if (room.users.size === 0) {
        rooms.delete(roomId);
      }
    }
  }

  console.log("Disconnected:", socket.id)
   });
})

export { io, app, server };
