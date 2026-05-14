import fs from "fs";
import { clients } from "../../utils/sseClients.js";
import cloudinary from "../../config/cloudinary.js";
import { CLOUDINARY_FOLDERS } from "../../contants/constant.js";
import path from "path";
import { cropVideo, getVideoDimension } from "../../utils/cropVideo.js";

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

// cropData = {x,y, height, width}
export const uploadCroppedImageVideo =  async (req, res) => {
  try {
    const {aspectRatio, cropData} = req.body;
    const file  = req.file;
    if(!file ) return res.status(400).json({message: "file is required"});
    const mimetype =file.mimetype;

    // image handling
    if (mimetype.startsWith("image")) {
      const cloudResponse = await cloudinary.uploader.upload(file.path, {
        folder: CLOUDINARY_FOLDERS.IMAGES,
        resource_type: "image",
      });

      // cleanup temp file
      fs.unlinkSync(file.path);

      return res.json({
        type: "image",
        url: cloudResponse.secure_url,
        publicId: cloudResponse.publicId,
        width: cloudResponse.width,
        height: cloudResponse.height,
        aspectRatio: cloudResponse.width / cloudResponse.height,
      });
    }

    // video handling
    if(mimetype.startsWith("video")){
      // cropping video
      const outputFilename = `cropped-${Date.now()}.mp4`;
      const outputPath = path.join(
        path.dirname(file.path), outputFilename
      );
      await cropVideo(file.path, outputPath, cropData);

      // final video dimensions
      const dimensions = await getVideoDimension(outputPath);
      const aspectRatio = dimensions.width / dimensions.height;
      
      const cloudResponse = await cloudinary.uploader.upload(outputPath, {
       folder: CLOUDINARY_FOLDERS.VIDEOS,
       resource_type: "video"
      });

      fs.unlinkSync(file.path)
      if(fs.existsSync(outputPath)){
        fs.unlinkSync(outputPath);
      }

      return res.json({
        type: "video",
        url: cloudResponse.secure_url,
        publicId: cloudResponse.publicId,
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio,
      });
      
    }
    throw new Error
  } catch (error) {
     console.log("Error in uploadCroppedImageVideo", error.message);
     return res.status(500).json({message: "Server Error"})


     
  }
}