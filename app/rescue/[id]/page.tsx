"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostById, Post } from "@/lib/api/posts";
import { useRouter } from "next/navigation"; 
import HeaderFavoriteButton from "../../../components/HeaderFavoriteButton";
import OptionsMenu from "../../../components/OptionsMenu";
import DetailsImage from "../../../components/DetailsImage";
import RescueDetailsInfo from "../../../components/RescueDetailsInfo";
import CommentsSection from "../../../components/CommentsSection";
import { useAuth } from "@/app/context/AuthContext";

export default function RescueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // 👈 1. جلب بيانات user الحالية بجانب token
  const { token, user } = useAuth(); 

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRescued, setIsRescued] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRescueCase() {
      try {
        setLoading(true);
        const data = await getPostById(resolvedParams.id, token ?? undefined);
        if (data) {
          setPost(data);
          setIsRescued(data.status === "CLOSED");
        }
      } catch (error) {
        console.error("Error fetching rescue details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRescueCase();
  }, [resolvedParams.id, token]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <p className="text-white text-lg font-bold">Loading case details...</p>
      </div>
    );
  }

  if (!post) {
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

  const formattedId = `Rescue #${String(post.id).padStart(2, "0")}`;

  const rescueData = {
    id: post.id,
    formattedId,
    city: post.city?.name ?? "Unknown",
    isInjured: post.is_injured ?? false,
    injuryDescription: post.injury_description ?? undefined,
    phone: post.contact_number ?? "N/A",
  };

  const handleRescueAction = () => {
    alert(
      `Thank you for offering to rescue ${formattedId}! Please contact the owner at ${rescueData.phone}`
    );
  };

  // 👈 2. التحقق من شرط الملكية (مع التأكد من تحويل المعرفات لنفس النوع سواء String أو Number)
  const isOwner = Boolean(user?.id && post.user?.id && String(user.id) === String(post.user.id));

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
            <Link
              onClick={() => router.back()}
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2">
              <HeaderFavoriteButton postId={post.id} initialFavorite={post.is_liked} />
              <OptionsMenu
                postId={post.id}
                ownerId={post.user?.id}
                postType="rescue"
                isDone={isRescued}
                onToggleStatus={(newStatus) => setIsRescued(newStatus)}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <DetailsImage
              src={post.image}
              alt={formattedId}
              isRescued={isRescued}
              isInjured={post.is_injured ?? false}
            />

            <RescueDetailsInfo
              rescueData={rescueData}
              isRescued={isRescued}
              isOwner={isOwner}
              onRescueAction={handleRescueAction}
            />
          </div>
        </div>

        <CommentsSection postId={post.id} postAuthorId={post.user?.id} />

      </div>
    </div>
  );
} 