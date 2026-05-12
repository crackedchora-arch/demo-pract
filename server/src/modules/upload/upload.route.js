import express from "express";
import upload from "../../middlewares/multerUpload.js";
import { uploadImage } from "./upload.controller.js";

const router = express.Router();

router.post("/image", upload.single("file"), uploadImage);

export default router;
