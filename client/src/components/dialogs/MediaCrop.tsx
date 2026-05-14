import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MediaType = "image" | "video" | null;

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// 🖼 helper: crop image
const getCroppedImage = async (
  imageSrc: string,
  cropPixels: CropArea,
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise<void>((res) => {
    image.onload = () => res();
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
};

export default function MediaCropDialogTS() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFramePreview, setVideoFramePreview] = useState<string | null>(
    null,
  );

  const onCropComplete = useCallback((_: any, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // 🖼 IMAGE CROP
  const handleImageCrop = async () => {
    if (!mediaUrl || !croppedAreaPixels) return;

    const cropped = await getCroppedImage(mediaUrl, croppedAreaPixels);
    setImagePreview(cropped);
  };

  // 🎥 VIDEO FRAME PREVIEW
  const captureVideoFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !croppedAreaPixels) return;

    const { x, y, width, height } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, x, y, width, height, 0, 0, width, height);

    setVideoFramePreview(canvas.toDataURL("image/png"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Select Media</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogTitle>Crop Media</DialogTitle>

        {/* FILE INPUT */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            setMediaUrl(url);

            setMediaType(file.type.startsWith("video") ? "video" : "image");
          }}
        />

        {/* CROP AREA */}
        {mediaUrl && (
          <div className="relative w-full h-[400px] mt-4 bg-black">
            {/* IMAGE */}
            {mediaType === "image" && (
              <Cropper
                image={mediaUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}

            {/* VIDEO (UI crop overlay) */}
            {mediaType === "video" && (
              <>
                <video ref={videoRef} src={mediaUrl} className="hidden" />

                <Cropper
                  image={mediaUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 mt-4">
          {mediaType === "image" && (
            <Button onClick={handleImageCrop}>Crop Image</Button>
          )}

          {mediaType === "video" && (
            <Button onClick={captureVideoFrame}>Preview Video Frame</Button>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* PREVIEWS */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {imagePreview && (
            <div>
              <h3 className="text-sm mb-2">Cropped Image</h3>
              <img src={imagePreview} className="rounded-xl border" />
            </div>
          )}

          {videoFramePreview && (
            <div>
              <h3 className="text-sm mb-2">Video Frame Preview</h3>
              <img src={videoFramePreview} className="rounded-xl border" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
