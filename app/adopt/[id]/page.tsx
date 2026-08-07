"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getCatById } from "@/lib/datad";
import { useRouter } from "next/navigation"; 
import HeaderFavoriteButton from "../../../components/HeaderFavoriteButton";
import OptionsMenu from "../../../components/OptionsMenu";
import DetailsImage from "../../../components/DetailsImage";
import CatDetailsInfo from "../../../components/CatDetailsInfo";
import CommentsSection from "../../../components/CommentsSection";

export default function AdoptionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const cat = getCatById(resolvedParams.id);
  const router = useRouter();
  const [isAdopted, setIsAdopted] = useState<boolean>(cat?.isAdopted || false);

  if (!cat) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-pink-950 mb-2">Cat Not Found</h2>
          <p className="text-gray-600 text-sm mb-4">The cat post you are looking for does not exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 px-5 py-2.5 rounded-2xl transition shadow-md"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAdopt = () => {
    alert(`Thank you for your interest in adopting ${cat.name}! 🐾`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          {/* Header */}
          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
            <Link
              onClick={() => router.back()}
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2">
              <HeaderFavoriteButton />
              <OptionsMenu
                postId={cat.id}
                postType="adoption"
                isDone={isAdopted}
                onToggleStatus={(newStatus) => setIsAdopted(newStatus)}
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* 1. الصورة ببادج التبني والجنس */}
            <DetailsImage
              src={cat.image}
              alt={cat.name}
              gender={cat.gender}
              isAdopted={isAdopted}
            />

            {/* 2. تفاصيل القطة والرقم المعروض */}
            <CatDetailsInfo cat={{ ...cat, phone: cat.phone }} />

            {/* 3. زر التبني الديناميكي المتغير بالحالة */}
            <button
              onClick={handleAdopt}
              disabled={isAdopted}
              className={`w-full py-4 px-6 font-bold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 ${
                isAdopted
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white hover:shadow-xl transform active:scale-[0.98] cursor-pointer"
              }`}
            >
              <Sparkles size={20} />
              <span>{isAdopted ? "Already Adopted" : `Adopt ${cat.name}`}</span>
            </button>
          </div>
        </div>

        {/* قسم التعليقات المستقل */}
        <CommentsSection postId={cat.id} />

      </div>
    </div>
  );
}
