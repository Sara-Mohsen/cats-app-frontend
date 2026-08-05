import React from "react";
import Link from "next/link";
import CatImage from "./CatImage";
import CatInfo from "./CatInfo";

type CardProps = {
  id: number | string;
  image: string;
  name: string;
  breed: string;
  age: string | number;
  city: string;
};

export default function Cards({
  id,
  image,
  name,
  breed,
  age,
  city,
}: CardProps) {
  return (
    <Link
      href={`/details/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        {/* الصورة (وتشمل زر المفضلة بداخله) */}
        <CatImage src={image} alt={name} />

        {/* معلومات القطة */}
        <CatInfo name={name} city={city} breed={breed} age={age} />
      </div>
    </Link>
  );
}
