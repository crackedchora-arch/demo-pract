import { spawn, execFile } from "child_process";
import ffprobe from "ffprobe-static";
import fs from "fs"
export const cropVideo = (inputPath, outputPath, crop) => {
  try {
    return new Promise((resolve, reject) => {
       console.log("INPUT PATH:", inputPath);

          if (!fs.existsSync(inputPath)) {
            return reject(new Error("Input file does not exist"));
          }

           const stats = fs.statSync(inputPath);

           console.log("FILE SIZE:", stats.size);

           if (stats.size === 0) {
             return reject(new Error("Uploaded file is empty"));
           }


      // initial ffmpeg command: ffmpeg -i input.mp4
     const args = ["-i", inputPath, "-f", "null", "-"];
      if (crop) {
        let { x, y, width, height } = crop;

        // sanitize values to int type
        x = Math.floor(x);
        y = Math.floor(y);
        width = Math.floor(width);
        height = Math.floor(height);

        // force even width and height, libx264 requires even dimensions
        width = width - (width % 2);
        height = height - (height % 2);

        if (width <= 0 || height <= 0) {
          return reject(new Error("Invalid crop size"));
        }

        // adding ffmpeg crop filter, command: -vf crop=500:700:100:50
        args.push("-vf", `crop=${width}:${height}:${x}:${y}`);
      }

      // video encoding settings
      args.push(
        "-c:v",
        "libx264", // video codec
        "-preset",
        "ultrafast", // faster: less CPU bigger file, slower: better compression, Choices: ultrafast, fast, medium, slow
        "-crf",
        "28", // quality level, higher: quality worse, lower: better quality
        "-c:a",
        "aac", // audio codec
        "-movflags",
        "+faststart", // to start streaming without downloading in browser
        "-y",
        outputPath, // -y: overwrite output if file exists
      );
        console.log("FFMPEG CMD:");
      console.log("ffmpeg args:", args.join(" "));
      if (!inputPath) {
        return reject(new Error("Input path is missing"));
      }

      // run ffmpeg command in terminal
      const ff = spawn("ffmpeg", args);

      // read ffmpeg logs
      ff.stderr.on("data", (data) => {
        console.log(data.toString());
      });
        ff.on("error", (err) => {
          reject(err);
        });
      ff.on("close", (code) => {
        if (code === 0) return resolve(true);
        else reject(new Error(`FFmpeg failed with code ${code}`));
      });
    });
  } catch (error) {
    console.log("error in cropVideo", error.message)
  }
};

export const getVideoDimension = (filePath) => {
  return new Promise((resolve, reject) => {
    execFile(ffprobe.path, [
      "-v",
      "error", // output only error, hides logs/warnings
      "-select_streams",
      "v:0", // a file may contain audio, video, subtitles. Select only video stream
      "-show_entries",
      "stream=width,height", // to only only height and width instead of large metadata
      "-of",
      "json", // output format
      filePath,
    ],
    (err, stdout) => {
      if (err) return reject(err);
      try {
        const data = JSON.parse(stdout);
        const stream = data.streams?.[0];
        if (!stream?.width || !stream?.height) {
          return reject(new Error("No video stream found"));
        }
        resolve({
          width: stream.width,
          height: stream.height,
        });
      } catch (error) {
          reject(error);
      }
      
    }
  );
  });
};
