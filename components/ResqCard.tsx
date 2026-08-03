// components/RescueCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, AlertCircle, Heart, Activity } from "lucide-react";

type RescueCardProps = {
  id: number | string;
  image: string;
  city: string;
  isInjured?: boolean;
};

export default function RescueCard({
  id,
  image,
  city,
  isInjured = false,
}: RescueCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const rescueId =
    typeof id === "number"
      ? `Rescue #${String(id).padStart(2, "0")}`
      : `Rescue #${id}`;

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // منع الانتقال لصفحة التفاصيل
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <Link
      href={`/rescue/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        
        {/* Container الصورة */}
        <div className="relative w-full h-72 overflow-hidden">
          <Image
            src={image}
            alt={rescueId}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* بادج Urgent على يسار الصورة */}
          {isInjured && (
            <div className="absolute top-3.5 left-3.5 bg-pink-100/60 backdrop-blur-md text-pink-800 text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 animate-pulse z-10 ">
              <AlertCircle size={14} />
              <span>Urgent</span>
            </div>
          )}

          {/* زر اللايك بنفس حجم وتصميم ورسمة الكود الثاني بالضبط */}
          <button
            type="button"
            onClick={toggleLike}
            aria-label="Add to Favorites"
            className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/70 backdrop-blur-md hover:bg-white border border-white/60 shadow-sm transition active:scale-90 z-10"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isLiked
                  ? "fill-pink-500 text-pink-500"
                  : "text-pink-400 group-hover:text-pink-500"
              }`}
            />
          </button>
        </div>

        {/* محتوى البطاقة: المعرف على اليسار، والمدينة مع حالة الصحة على اليمين */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            {/* عنوان المعرف - يتغير للون الأحمر عند الهوفر */}
            <h3 className="text-xl font-extrabold text-pink-950 transition-colors duration-300 group-hover:text-pink-600">
              {rescueId}
            </h3>

            {/* المدينة وحالة الصحة على جهة اليمين بنفس التناسق */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {/* badge المدينة */}
              <span className="flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100">
                <MapPin size={12} className="text-pink-400" />
                {city}
              </span>

              {/* badge حالة الصحة */}
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl border ${
                  isInjured
                    ? "text-purple-600 bg-purple-50 border-purple-100"
                    : "text-gray-600 bg-gray-100 border-gray-200"
                }`}
              >
                <Activity size={12} />
                {isInjured ? "Injured" : "Healthy"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
