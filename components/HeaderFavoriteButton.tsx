"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toggleLikeApi } from "@/lib/api/posts";

type HeaderFavoriteButtonProps = {
  postId: string | number;
  initialFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
};

export default function HeaderFavoriteButton({
  postId,
  initialFavorite = false, 
  onToggle,
}: HeaderFavoriteButtonProps) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isLikedLocally, setIsLikedLocally] = useState<boolean | null>(null);
  const isFavorite = isLikedLocally !== null ? isLikedLocally : initialFavorite;

  const toggleFavorite = async () => {
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