import { useState } from "react";
import { useUploadImageMutation } from "../services/api/uploadApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UploadComponent() {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [uploadImage, { isLoading, data, error, reset }] = useUploadImageMutation();
    console.log("image data", data)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProgress(0);

    try {
      await uploadImage({
        file,
        onProgress: (percent: number) => {
          setProgress(percent);
        },
      }).unwrap();
      setTimeout(() => setProgress(0), 400);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    // 👇 RESET EVERYTHING WHEN CLOSING
    if (!val) {
      setProgress(0);
      reset?.(); // clears RTK mutation state (data + error)
    }
  };

  return (
    <div className="flex justify-center ">
      {/* 👇 Trigger Button */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>Upload Image</Button>
        </DialogTrigger>

        {/* 👇 Dialog Box */}
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>

          <Card className="border-none shadow-none">
            <CardContent className="space-y-4">
              {/* File Input */}
              <div className="space-y-2">
                <Label>Select file</Label>
                <Input type="file" onChange={handleUpload} />
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

              {/* Uploaded Image */}
              {data && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600 font-medium">
                    Upload Successful
                  </p>
                  {data.resource_type === "video" ? (
                    <video
                      src={data.secure_url}
                      autoPlay
                      controls
                      className="rounded-xl w-full object-cover"
                    />
                  ) : (
                    <img
                      src={data.secure_url}
                      alt="uploaded"
                      className="rounded-xl w-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">
                  Upload failed. Try again.
                </p>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
