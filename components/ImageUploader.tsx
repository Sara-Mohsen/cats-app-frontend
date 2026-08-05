"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

type ImageUploaderProps = {
  imagePreview: string | null;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUploader({
  imagePreview,
  onImageChange,
}: ImageUploaderProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-pink-900 uppercase tracking-wider mb-2">
        Cat Photo *
      </label>
      <div className="relative border-2 border-dashed border-pink-300 hover:border-pink-500 rounded-2xl bg-white/60 p-4 transition text-center cursor-pointer flex flex-col items-center justify-center min-h-40">
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          required={!imagePreview}
        />
        {imagePreview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center text-pink-400">
            <Upload size={32} className="mb-2" />
            <span className="text-sm font-semibold">Click to upload photo</span>
          </div>
        )}
      </div>
    </div>
  );
}
