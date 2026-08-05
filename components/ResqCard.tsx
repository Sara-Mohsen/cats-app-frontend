import React from "react";
import Link from "next/link";
import CatImage from "./CatImage";
import RescueInfo from "./RescueInfo";

type RescueCardProps = {
  id: number | string;
  image: string;
  city: string;
  isInjured?: boolean;
  isRescued?: boolean;
};

export default function RescueCard({
  id,
  image,
  city,
  isInjured = false,
  isRescued = false,
}: RescueCardProps) {
  const rescueId =
    typeof id === "number"
      ? `Rescue #${String(id).padStart(2, "0")}`
      : `Rescue #${id}`;

  return (
    <Link
      href={`/rescue/${id}`}
      className="group block cursor-pointer active:scale-98 transition-transform duration-200"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-pink-100/60">
        
        {/* الصورة + البادج الممرر + زر المفضلة */}
        <CatImage
          src={image}
          alt={rescueId}
          isRescued={isRescued}
          isInjured={isInjured}
        />

        {/* تفاصيل حالة الإنقاذ */}
        <RescueInfo
          rescueId={rescueId}
          city={city}
          isInjured={isInjured}
        />

      </div>
    </Link>
  );
}
