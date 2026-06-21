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

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, peerId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);
  });
});

export { io, app, server };
