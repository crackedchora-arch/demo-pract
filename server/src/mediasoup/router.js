import { mediaCodecs } from "./config.js"
import { createWorker } from "./worker.js"


export const createRouter = async() => {
    const worker = await createWorker()
    const router = await worker.createRouter(mediaCodecs)
    console.log("router created")
    return router;
} 