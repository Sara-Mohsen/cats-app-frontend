import React from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle, PartyPopper } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

type CatImageProps = {
  src: string;
  alt: string;
  showFavorite?: boolean;
  isAdopted?: boolean;
  isRescued?: boolean;
  isInjured?: boolean;
  children?: React.ReactNode;
};

export default function CatImage({
  src,
  alt,
  showFavorite = true,
  isAdopted = false,
  isRescued = false,
  isInjured = false,
  children,
}: CatImageProps) {
  return (
    <div className="relative w-full h-72 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 👈 بادج Adopted */}
      {isAdopted && (
        <span className="absolute top-3.5 left-3.5 bg-purple-200/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 z-10">
          <PartyPopper size={14} className="text-purple-800" />
          <span>Adopted</span>
        </span>
      )}

      {/* 👈 بادج Rescued أو Urgent لحالات الإنقاذ */}
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

      {/* محتوى إضافي مخصص */}
      {children}

      {/* زر المفضلة */}
      {showFavorite && <FavoriteButton />}
    </div>
  );
}
