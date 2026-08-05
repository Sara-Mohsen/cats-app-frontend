import React from "react";
import Image from "next/image";
import { CheckCircle, AlertTriangle, PartyPopper } from "lucide-react";

type DetailsImageProps = {
  src: string;
  alt: string;
  gender?: string;
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
  return (
    <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-pink-100 mb-6 group">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        priority
      />

      {/* بادج الجنس (أعلى اليمين) */}
      {gender && (
        <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white z-10">
          {gender === "Male" ? "♂ Male" : "♀ Female"}
        </span>
      )}

      {/* بادجات الحالة (أعلى اليسار) */}
      {/* 1. بادج التبني */}
      {isAdopted ? (
        <span className="absolute top-4 left-4 bg-purple-200/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 animate-in fade-in duration-300 z-10">
          <PartyPopper size={15} className="text-purple-800" />
          <span>Adopted</span>
        </span>
      ) : isRescued ? (
        /* 2. بادج الإنقاذ */
        <span className="absolute top-4 left-4 bg-purple-100/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-purple-300/40 flex items-center gap-1.5 animate-in fade-in duration-300 z-10">
          <CheckCircle size={15} className="text-purple-800" />
          <span>Cat Rescued!</span>
        </span>
      ) : (
        isInjured && (
          /* 3. بادج حالة الإصابة العاجلة */
          <span className="absolute top-4 left-4 bg-pink-100/60 backdrop-blur-md text-pink-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 animate-pulse z-10">
            <AlertTriangle size={14} />
            <span>Urgent Medical Attention</span>
          </span>
        )
      )}
    </div>
  );
}
