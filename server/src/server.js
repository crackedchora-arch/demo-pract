import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./modules/user/user.route.js";
import sseRoutes from "./modules/sseEvents/sseEvents.router.js";
import uploadRoutes from "./modules/upload/upload.route.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import peerServer from "./peer/peer.js";

dotenv.config();

const port = 5000;
app.use(express.json({ limit: "10mb" }));

app.use(cors({ origin: true }));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);

app.use("/api/upload", uploadRoutes);
app.use("/api/sse", sseRoutes);
app.use("/peerjs", peerServer);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
