import mediasoup from "mediasoup"

export const createWorker = async()=> {
    const worker = await mediasoup.createWorker({
        rtcMaxPort: 49000,
        rtcMinPort: 40000
    })
    console.log("worker created:", worker.pid)

    worker.on("died", () => {
        console.log("mediasoup worker died")
        process.exit(0)
    })

    return worker;
}