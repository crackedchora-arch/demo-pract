import express from "express";
import upload from "../../middlewares/multerUpload.js";
import { uploadCroppedImageVideo, uploadImage } from "./upload.controller.js";

const router = express.Router();

router.post("/image", upload.single("file"), uploadImage);
router.post("/cropped-image-video",upload.single("file"), uploadCroppedImageVideo)

export default router;
