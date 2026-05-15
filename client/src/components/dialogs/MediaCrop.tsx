import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const aspectRatios = [
  {
    label: "square",
    value: 1,
  },
  {
    label: "portrait",
    value: 4 / 5,
  },
  {
    label: "story",
    value: 9 / 16,
  },
  {
    label: "landscape",
    value: 16 / 9,
  },
];

const MediaCrop = () => {
   const [file, setFile] = useState(null);
   const [mediaType, setMediaType] = useState("");
   const [mediaSrc, setMediaSrc] = useState("");

   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);

   const [aspect, setAspect] = useState(1);

   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

   const [previewImage, setPreviewImage] = useState("");

   const videoRef = useRef(null);

  
  const handleFileChange = (e: any) => {
    const file = e.target?.files?.[0];
    if(!file) return

    setFile(file);

    const type = file.type.startsWith("video") ? "video" : "image";
  }
  
  const createImagePreview = () => {

  }
  
  const onCropComplete = () => {

  }

  const handleUpload = () => {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Media Cropper</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-full rounded-3xl p-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Crop Image / Video
            </DialogTitle>
          </DialogHeader>

          {/* File Input */}

          <div className="space-y-2">
            <Label>Select Media</Label>

            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Aspect Ratio Buttons */}

          <div className="flex flex-wrap gap-3">
            {aspectRatios.map((aspectItem, i) => (
              <Button
                key={i}
                type="button"
                variant={aspect === aspectItem.value ? "default" : "outline"}
                className="capitalize rounded-xl"
                onClick={() => setAspect(aspectItem.value)}
              >
                {aspectItem.label}
              </Button>
            ))}
          </div>

          {/* Cropper */}

          {mediaSrc && (
            <div className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden">
              <Cropper
                image={mediaType === "image" ? mediaSrc : undefined}
                video={mediaType === "video" ? mediaSrc : undefined}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {/* Zoom */}

          {mediaSrc && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Zoom</Label>

                <span className="text-sm text-muted-foreground">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>
          )}

          {/* Image Preview */}

          {previewImage && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Image Preview</h3>

              <img
                src={previewImage}
                alt="preview"
                className="w-[300px] rounded-2xl border shadow"
              />
            </div>
          )}

          {/* Video Preview */}

          {mediaType === "video" && mediaSrc && croppedAreaPixels && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Video Preview Frame</h3>

              <div className="relative inline-block rounded-2xl overflow-hidden border">
                <video
                  ref={videoRef}
                  src={mediaSrc}
                  controls
                  className="w-[400px]"
                />

                <div
                  className="absolute border-2 border-red-500 pointer-events-none"
                  style={{
                    left: `${croppedAreaPixels.x}px`,
                    top: `${croppedAreaPixels.y}px`,
                    width: `${croppedAreaPixels.width}px`,
                    height: `${croppedAreaPixels.height}px`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-wrap gap-3 pt-2">
            {mediaType === "image" && (
              <Button
                variant="secondary"
                onClick={createImagePreview}
                className="rounded-xl"
              >
                Generate Preview
              </Button>
            )}

            {mediaSrc && croppedAreaPixels && (
              <Button onClick={handleUpload} className="rounded-xl">
                Upload Cropped Media
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MediaCrop;