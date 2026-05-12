import fs from "fs";
import { clients } from "../../utils/sseClients.js";
import cloudinary from "../../config/cloudinary.js";
import { CLOUDINARY_FOLDERS } from "../../contants/constant.js";

export const uploadImage = async (req, res) => {
  try {

    const filePath = req.file.path;
    const uploadId = req.body.uploadId;

    const totalBytes = fs.statSync(filePath).size;

    let uploadedBytes = 0;

    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => {
      uploadedBytes += chunk.length;

      const progress = Math.round((uploadedBytes / totalBytes) * 100);
      console.log(`Upload Progress: ${progress}%`);
      const client = clients[uploadId];

      if (client) {
        client.write(
          `data: ${JSON.stringify({
            progress,
          })}\n\n`,
        );
      }
    });

    const cloudinaryUpload = cloudinary.uploader.upload_stream(
      {
        folder: "demo_pract"
      },

      async (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Upload failed",
          });
        }

        const client = clients[uploadId];

        if (client) {
          client.write(
            `data: ${JSON.stringify({
              progress: 100,
              done: true,
              url: result.secure_url,
            })}\n\n`,
          );

          client.end();
          delete clients[uploadId];
        }

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Delete error:", err.message);
          } else {
            console.log("Temp file removed");
          }
        });

        return res.json(result);
      },
    );

    stream.pipe(cloudinaryUpload);
   
  } catch (error) {
    console.log("error in uploadImage:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
