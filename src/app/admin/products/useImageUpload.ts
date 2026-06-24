// app/admin/products/useImageUpload.ts
"use client";

import { useState, useRef } from "react";

export function useImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview فوري بدون رفع
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ✅ الرفع بيحصل بس لما تيجي تضيف المنتج
  async function uploadToCloudinary(): Promise<string> {
    const file = fileInputRef.current?.files?.[0];
    if (!file) throw new Error("ارفع صورة أولاً");

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      uploadData.append("folder", "assaf");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadData }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data);

      if (!data.secure_url) {
        throw new Error(data.error?.message || "فشل رفع الصورة");
      }

      return data.secure_url as string;
    } finally {
      setIsUploading(false);
    }
  }

  function reset() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return {
    imagePreview,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    uploadToCloudinary,
    reset,
  };
}