"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

type HeaderFavoriteButtonProps = {
  initialFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
};

export default function HeaderFavoriteButton({
  initialFavorite = false,
  onToggle,
}: HeaderFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label="Add to Favorites"
      className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-pink-100 transition shadow-xs flex items-center justify-center active:scale-95 cursor-pointer"
    >
      <Heart
        size={20}
        className={`transition-colors duration-300 ${
          isFavorite
            ? "fill-pink-500 text-pink-500"
            : "text-pink-400 hover:text-pink-600"
        }`}
      />
    </button>
  );
}
