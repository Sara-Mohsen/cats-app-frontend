'use client';
import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle, PartyPopper } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

type CatImageProps = {
  src?: string;
  alt: string;
  postId: string;
  showFavorite?: boolean;
  initialFavorite?: boolean;
  isAdopted?: boolean;
  isRescued?: boolean;
  isInjured?: boolean;
  children?: React.ReactNode; 
};

export default function CatImage({
  src,
  alt,
  postId,
  showFavorite = true,
  initialFavorite = false,
  isAdopted = false,
  isRescued = false,
  isInjured = false,
  children,
}: CatImageProps) { 
  const fallbackSrc = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba";
  const API_BASE_URL = "http://localhost:8000"; 

  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return fallbackSrc;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/${imagePath}`;
  };

  const [imgSrc, setImgSrc] = useState<string>(formatImageUrl(src));

  return (
    <div className="relative w-full h-72 overflow-hidden bg-gray-100">
      <Image
        src={imgSrc}
        alt={alt || "Cat Image"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgSrc(fallbackSrc)}
        unoptimized={true}
      />

      {isAdopted && (
        <span className="absolute top-3.5 left-3.5 bg-purple-200/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 z-10">
          <PartyPopper size={14} className="text-purple-800" />
          <span>Adopted</span>
        </span>
      )}

      {!isAdopted && isRescued && (
        <div className="absolute top-3.5 left-3.5 bg-purple-100/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 z-10">
          <CheckCircle size={14} className="text-purple-800" />
          <span>Rescued!</span>
        </div>
      )}

      {!isAdopted && !isRescued && isInjured && (
        <div className="absolute top-3.5 left-3.5 bg-pink-100/60 backdrop-blur-md text-pink-800 text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 animate-pulse z-10">
          <AlertCircle size={14} />
          <span>Urgent</span>
        </div>
      )}

      {children}
      {showFavorite && <FavoriteButton postId={postId} initialFavorite={initialFavorite}/>}
    </div>
  );
}