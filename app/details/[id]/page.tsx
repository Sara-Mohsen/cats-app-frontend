"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCatById } from "@/lib/data";

import OptionsMenu from "../../../components/OptionsMenu";
import CatDetailsInfo from "../../../components/CatDetailsInfo";
import CommentsSection from "../../../components/CommentsSection";
import HeaderFavoriteButton from "../../../components/HeaderFavoriteButton";
import DetailsImage from "../../../components/DetailsImage";

export default function CatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const cat = getCatById(resolvedParams.id);

  if (!cat) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-pink-950 mb-2">Cat Not Found</h2>
          <p className="text-gray-600 text-sm mb-4">
            The cat post you are looking for does not exist.
          </p>
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        {/* Main Details Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          {/* Top Bar */}
          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <HeaderFavoriteButton />
              {/* المنيو المطور: جاهز للتعديل والحذف للبوست العادي */}
              <OptionsMenu postId={cat.id} postType="normal" />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* الصورة وشارة الجنس عبر المكون الموحد DetailsImage */}
            <DetailsImage
              src={cat.image}
              alt={cat.name}
              gender={cat.gender}
            />

            {/* تفاصيل القطة */}
            <CatDetailsInfo cat={cat} />
          </div>
        </div>

        {/* قسم التعليقات المترابط والمستقل */}
        <CommentsSection postId={cat.id} /> 

      </div>
    </div>
  );
}
