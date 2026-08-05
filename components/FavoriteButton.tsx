"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  initialFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
};

export default function FavoriteButton({
  initialFavorite = false,
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // منع الانتقال للرابط عند النقر
    e.stopPropagation();
    
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) onToggle(newState);
  };

  return (
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
  );
}
