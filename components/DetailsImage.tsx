"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, AlertTriangle, PartyPopper } from "lucide-react";

type DetailsImageProps = {
  src: string;
  alt: string;
  gender?: string | null;
  isAdopted?: boolean;
  isRescued?: boolean;
  isInjured?: boolean;
};

export default function DetailsImage({
  src,
  alt,
  gender,
  isAdopted = false,
  isRescued = false,
  isInjured = false,
}: DetailsImageProps) {
  const fallbackSrc = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba";
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
 
  return (
    <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-pink-100 mb-6 group bg-gray-100">
      <Image
        src={imgSrc}
        alt={alt || "Cat Details"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        priority
        onError={() => setImgSrc(fallbackSrc)}
        unoptimized={imgSrc.startsWith("http://127.0.0.1") || imgSrc.startsWith("http://localhost")}
      />

      {gender && gender !== "UNKNOWN" && (
        <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white z-10">
          {gender === "MALE" ? "♂ Male" : "♀ Female"}
        </span>
      )}

      {isAdopted ? (
        <span className="absolute top-4 left-4 bg-purple-200/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 z-10">
          <PartyPopper size={15} className="text-purple-800" />
          <span>Adopted</span>
        </span>
      ) : isRescued ? (
        <span className="absolute top-4 left-4 bg-purple-100/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-purple-300/40 flex items-center gap-1.5 z-10">
          <CheckCircle size={15} className="text-purple-800" />
          <span>Cat Rescued!</span>
        </span>
      ) : (
        isInjured && (
          <span className="absolute top-4 left-4 bg-pink-100/80 backdrop-blur-md text-pink-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border border-pink-200 flex items-center gap-1.5 animate-pulse z-10">
            <AlertTriangle size={14} />
            <span>Urgent Medical Attention</span>
          </span>
        )
      )}
    </div>
  );
}
