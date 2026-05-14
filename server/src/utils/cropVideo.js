export const cropVideo = async (inputPath, outputPath, crop) => {
  try {
    return new Promise((resolve, reject) => {
      // initial ffmpeg command: ffmpeg -i input.mp4
      const args = ["-i", inputPath];
      if (crop) {
        const { x, y, width, height } = crop;

        // sanitize values to int type
        x = Math.floor(x);
        y = Math.floor(y);
        width = Math.floor(width);
        height = Math.floor(height);

        // force even width and height, libx264 requires even dimensions
        width = width - (width % 2);
        height = height - (height % 2);

        if(width <= 0  || height <= 0 ){
            return reject(new Error("Invalid crop size"));
        }

        // adding ffmpeg crop filter, command: -vf crop=500:700:100:50
        args.push("-vf", `crop=${width}:${height}:${x}:${y}`)
      }

      // video encoding settings





      
    });
  } catch (error) {}
};
