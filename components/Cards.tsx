import React from "react";
import Link from "next/link";
import CatImage from "./CatImage";
import CatInfo from "./CatInfo";

type CardProps = {
  id: number | string;
  image: string;
  name?: string | null;
  breed?: string | null;
  age?: string | number | null;
  city?: string | null;
  status?: "ACTIVE" | "CLOSED";
  type?: "NORMAL" | "ADOPTION" | "RESCUE";
  isInjured?: boolean | null;
  isLiked?: boolean;
};

export default function Cards({
  id,
  image,
  name,
  breed,
  age,
  city,
  status,
  type,
  isInjured,
  isLiked = false,
}: CardProps) {
  const isAdopted = type === "ADOPTION" && status === "CLOSED";
  const isRescued = type === "RESCUE" && status === "CLOSED";

  return (
    <Link
      href={`/details/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        <CatImage
          src={image}
          alt={name ?? "Cat"}
          postId={String(id)}
          isAdopted={isAdopted}
          isRescued={isRescued}
          isInjured={!!isInjured}
          initialFavorite={isLiked}
        />

        <CatInfo
          name={name}
          city={city}
          breed={breed}
          age={age}
        />
      </div>
    </Link>
  );
}
