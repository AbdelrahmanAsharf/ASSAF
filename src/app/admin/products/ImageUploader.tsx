// app/admin/products/ImageUploader.tsx
"use client";

import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

interface Props {
  imagePreview: string | null;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ImageUploader({
  imagePreview,
  isUploading,
  fileInputRef,
  onFileChange,
  onRemove,
}: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">
        صورة المنتج
      </label>
      <div className="flex items-start gap-4">
        {/* Preview Box */}
        <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">جاري الرفع...</p>
            </div>
          ) : imagePreview ? (
            <>
              <Image src={imagePreview} alt="preview" fill className="object-cover rounded-xl" />
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <ImageIcon className="w-8 h-8" />
              <p className="text-xs">لا توجد صورة</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {imagePreview ? "تغيير الصورة" : "اختر صورة"}
          </label>
          {imagePreview && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              حذف الصورة
            </button>
          )}
          <p className="text-xs text-gray-400">PNG, JPG حتى 5MB</p>
        </div>
      </div>
    </div>
  );
}