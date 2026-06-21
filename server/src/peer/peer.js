import { ExpressPeerServer } from "peer";
import { server } from "../socket/socket.js";

const peerServer = ExpressPeerServer(server);
export default peerServer;
