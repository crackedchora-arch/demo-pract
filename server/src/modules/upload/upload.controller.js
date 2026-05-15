import fs from "fs"
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
    const {aspectRatio} = req.body;
    const cropData = JSON.parse(req.body.cropData)
    const file  = req.file;
    console.log("File info:", file);
    console.log("File path exists?", fs.existsSync(file.path));
    console.log("File size:", fs.statSync(file.path).size);
    if(!file ) return res.status(400).json({message: "file is required"});
    const mimetype =file.mimetype;

    // image handling
    if (mimetype.startsWith("image")) {
     
      const cloudResponse = await cloudinary.uploader.upload(file.path, {
        folder: CLOUDINARY_FOLDERS.IMAGES,
        resource_type: "image",
        transformation: [
          {
            x: cropData.x,
            y: cropData.y,
            width: cropData.width,
            height: cropData.height,
            crop: "crop"
          }
        ]
      });

      // cleanup temp file
      fs.unlinkSync(file.path);

      return res.json({
        type: "image",
        url: cloudResponse.secure_url,
        publicId: cloudResponse.public_id,
        width: cropData.width,
        height: cropData.height,
        aspectRatio: cropData.width / cropData.height,
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
console.log("hi");
      // final video dimensions
      const dimensions = await getVideoDimension(outputPath);
      const finalAspectRatio = dimensions.width / dimensions.height;
      
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
        publicId: cloudResponse.public_id,
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: finalAspectRatio,
      });
      
    }
    throw new Error("unsupported file type")
  } catch (error) {
     console.log("Error in uploadCroppedImageVideo", error.message);
     return res.status(500).json({message: "Server Error"})


     
  }
}