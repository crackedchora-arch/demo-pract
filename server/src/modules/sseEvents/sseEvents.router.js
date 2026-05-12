import express from "express"
import {clients} from "../../utils/sseClients.js"

const router = express.Router();

router.get("/progress/:uploadId", (req, res) => {
    const {uploadId} = req.params;

    // setting headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // flush  to client to prevent wait
    res.flushHeaders();

    clients[uploadId] = res;

    req.on("close", () => {
        delete clients[uploadId];
    });

})

export default router;