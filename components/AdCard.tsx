import React from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import CatImage from "./CatImage";
import CatInfo from "./CatInfo";

type AdCardProps = {
  id: number | string;
  image: string;
  name: string;
  breed: string;
  age: string | number;
  city: string;
  phone?: string;
  isAdopted?: boolean;
};

export default function AdCards({
  id,
  image,
  name,
  breed,
  age,
  city,
  isAdopted = false,
}: AdCardProps) {
  return (
    <Link
      href={`/adopt/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        
        {/* الصورة + زر المفضلة + بادج التبني */}
        <CatImage src={image} alt={name}>
          {isAdopted && (
            <span className="absolute top-3.5 left-3.5 bg-purple-200/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-purple-300/40 flex items-center gap-1.5 z-10">
              <PartyPopper size={14} className="text-purple-800" />
              <span>Adopted</span>
            </span>
          )}
        </CatImage>

        {/* تفاصيل القطة */}
        <CatInfo name={name} city={city} breed={breed} age={age} />

      </div>
    </Link>
  );
}
