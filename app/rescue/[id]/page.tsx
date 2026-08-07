"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRescueById } from "@/lib/datar";
import { useRouter } from "next/navigation"; 
import HeaderFavoriteButton from "../../../components/HeaderFavoriteButton";
import OptionsMenu from "../../../components/OptionsMenu";
import DetailsImage from "../../../components/DetailsImage";
import RescueDetailsInfo from "../../../components/RescueDetailsInfo";
import CommentsSection from "../../../components/CommentsSection";

export default function RescueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rescueData = getRescueById(resolvedParams.id);
  const router = useRouter();
  

  // 👈 State تفاعلي لحالة الإنقاذ لتحديث الصفحة فوراً
  const [isRescued, setIsRescued] = useState<boolean>(
    rescueData?.isRescued || false
  );

  if (!rescueData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-pink-950 mb-2">
            Case Not Found
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Rescue case could not be found.
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

  const formattedId =
    rescueData.formattedId ||
    `Rescue #${String(rescueData.id).padStart(2, "0")}`;

  const handleRescueAction = () => {
    alert(
      `Thank you for offering to rescue ${formattedId}! Please contact the owner at ${rescueData.phone}`
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        {/* بطاقة التفاصيل الرئيسية */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          {/* شريط التحكم العلوي */}
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
              {/* المنيو المطور: تغيير الحالة التفاعلي */}
              <OptionsMenu
                postId={rescueData.id}
                postType="rescue"
                isDone={isRescued}
                onToggleStatus={(newStatus) => setIsRescued(newStatus)}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* 1. الصورة وشارة الإنقاذ */}
            <DetailsImage
              src={rescueData.image}
              alt={formattedId}
              isRescued={isRescued}
              isInjured={rescueData.isInjured}
            />

            {/* 2. تفاصيل حالة الإنقاذ مع تمرير isRescued لتحديث شكل الزر السفلي */}
            <RescueDetailsInfo
              rescueData={{ ...rescueData, formattedId }}
              isRescued={isRescued} // 👈 التعديل المهم هنا لتغيير شكل ونص الزر السفلي
              onRescueAction={handleRescueAction}
            />
          </div>
        </div>

        {/* 3. قسم التعليقات المستقل */}
        <CommentsSection postId={rescueData.id} />

      </div>
    </div>
  );
}
