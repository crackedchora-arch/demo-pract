import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function VideoCropper() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [framePreview, setFramePreview] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 🔥 capture crop data from react-easy-crop
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // 🎯 extract frame preview using crop
  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !croppedAreaPixels) return;

    const { x, y, width, height } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, x, y, width, height, 0, 0, width, height);

    setFramePreview(canvas.toDataURL("image/png"));
  };

  // 📤 upload crop + video
  const uploadVideo = async () => {
    const file = document.querySelector("input[type=file]").files[0];

    const formData = new FormData();
    formData.append("video", file);
    formData.append("crop", JSON.stringify(croppedAreaPixels));

    await fetch("http://localhost:5000/video-crop", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div>
      <h1>Video Cropper (react-easy-crop)</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoUrl(URL.createObjectURL(e.target.files[0]))}
      />

      {/* 🎥 VIDEO + CROP OVERLAY */}
      {videoUrl && (
        <div style={{ position: "relative", width: 400, height: 300 }}>
          {/* hidden video for frame extraction */}
          <video
            ref={videoRef}
            src={videoUrl}
            style={{ display: "none" }}
            onLoadedData={captureFrame}
          />

          {/* crop UI */}
          <Cropper
            image={videoUrl} // works as video frame proxy
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button onClick={captureFrame}>Preview Cropped Frame</button>

      {framePreview && (
        <div>
          <h3>Preview</h3>
          <img src={framePreview} />
        </div>
      )}

      <button onClick={uploadVideo}>Upload Cropped Video</button>
    </div>
  );
}
