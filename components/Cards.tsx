"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PawPrint, Cake, MapPin, Heart } from "lucide-react";

type CardProps = {
  id: number | string;
  image: string;
  name: string;
  breed: string;
  age: string | number;
  city: string; // 👈 إضافة المدينة للـ Props
};

export default function Cards({
  id,
  image,
  name,
  breed,
  age,
  city,
}: CardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // 👈 تمنع الانتقال لصفحة التفاصيل عند الضغط على القلب
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <Link
      href={`/details/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        
        {/* Container الصورة */}
        <div className="relative w-full h-72 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* زر المفضلة (القلب) أعلى يمين الصورة */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label="Add to Favorites"
            className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/70 backdrop-blur-md hover:bg-white border border-white/60 shadow-sm transition active:scale-90 z-10"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isFavorite
                  ? "fill-pink-500 text-pink-500"
                  : "text-pink-400 group-hover:text-pink-500"
              }`}
            />
          </button>
        </div>

        {/* تفاصيل القطة */}
        <div className="p-5 space-y-3">
          {/* الاسم والمدينة */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-extrabold text-pink-950 transition-colors duration-300 group-hover:text-pink-600">
              {name}
            </h3>
            
            {/* badge المدينة */}
            <span className="flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100">
              <MapPin size={12} className="text-pink-400" />
              {city}
            </span>
          </div>

          {/* الفصيلة والعمر */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 pt-1 border-t border-pink-50">
            <p className="flex items-center gap-1.5 text-pink-900/80">
              <PawPrint className="w-4 h-4 text-pink-400" />
              <span>{breed}</span>
            </p>

            <p className="flex items-center gap-1.5 text-purple-900/80">
              <Cake className="w-4 h-4 text-purple-400" />
              <span>{typeof age === "number" ? `${age} Years` : age}</span>
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}
