"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toggleLikeApi } from "@/lib/api/posts";

type FavoriteButtonProps = {
  postId: string | number;
  initialFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
};

export default function FavoriteButton({
  postId,
  initialFavorite = false,
  onToggle, 
}: FavoriteButtonProps) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isLikedLocally, setIsLikedLocally] = useState<boolean | null>(null);
  const isFavorite = isLikedLocally !== null ? isLikedLocally : initialFavorite;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      alert("Please log in to like this post! 🐾");
      router.push("/login");
      return;
    }

    const newState = !isFavorite;
    setIsLikedLocally(newState);
    
    try {
      await toggleLikeApi(postId, token);
      if (onToggle) onToggle(newState);
    } catch (error) {
      setIsLikedLocally(!newState); 
    }
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