
import { useState } from "react";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useUploadFromServerMutation } from "@/services/api/uploadApi2";

const UploadImageFromServer = () => {
    const [uploadImage] = useUploadFromServerMutation();
     const [file, setFile] = useState<File | null>(null);
     const [uploadId, setUploadId] = useState<string>("");
     const [progress, setProgress] = useState(0);
     const [imageUrl, setImageUrl] = useState<string | null>(null);
     const [open, setOpen] = useState(false);


     const handleUpload = async() => {
       
             if (!file) return;

            
             const uploadId = window.crypto.randomUUID();

             
             setProgress(0);
             setImageUrl(null);

             const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URI}/sse/progress/${uploadId}`);

             eventSource.onmessage = (event) => {
                const  data = JSON.parse(event.data);
                setProgress(data.progress);
                if (data.done) {
                  setImageUrl(data.url);
                  eventSource.close();
                }

             }
              
         try {
           // upload file through rtk query
           const formData = new FormData();
           formData.append("file", file);
           formData.append("uploadId", uploadId)
           await uploadImage(formData).unwrap();
         } catch (error: any) {
             console.error("Upload failed:", error.data.message);

             // cleanup SSE on failure
             eventSource.close();
         }
     }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Image: Server</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          {/* Upload Button */}
          <Button onClick={handleUpload} disabled={!file}>
            Start Upload
          </Button>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500">Uploading... {progress}%</p>
            </div>
          )}

          {/* Success State */}
          {imageUrl && (
            <div className="space-y-2">
              <p className="text-green-600 text-sm">Upload Complete 🎉</p>

              <img
                src={imageUrl}
                alt="uploaded"
                className="rounded-md w-full"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadImageFromServer
