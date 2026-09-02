"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; 
import OptionsMenu from "@/components/OptionsMenu";
import CatDetailsInfo from "@/components/CatDetailsInfo";
import CommentsSection from "@/components/CommentsSection";
import HeaderFavoriteButton from "@/components/HeaderFavoriteButton";
import DetailsImage from "@/components/DetailsImage";
import { getPostById, Post } from "@/lib/api/posts";
import { useAuth } from "@/app/context/AuthContext";

export default function CatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { token } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
 
  useEffect(() => {
    async function fetchCatDetails() {
      try {
        setLoading(true);
        const data = await getPostById(resolvedParams.id, token ?? undefined);
        if (data) {
          setPost(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching cat details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (resolvedParams.id) {
      fetchCatDetails();
    }
  }, [resolvedParams.id, token]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-pink-600 font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading cat details...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-pink-950 mb-2">Cat Not Found</h2>
          <p className="text-gray-600 text-sm mb-4">
            The cat post you are looking for does not exist or has been removed.
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

  const catDetailsData = {
    name: post.name || "Unknown",
    breed: post.breed?.name || "Unknown",
    age: post.age !== null && post.age !== undefined ? post.age : "N/A",
    city: post.city?.name || "Unknown",
    gender: post.gender || "Unknown",
    isNeutered: post.is_neutered ?? null,
    isVaccinated: post.is_vaccinated ?? null,
    personality: post.personality || "No description provided.",
    phone: post.contact_number || null,
  };


  const isAdopted = post.type === "ADOPTION" && post.status === "CLOSED";
  const isRescued = post.type === "RESCUE" && post.status === "CLOSED";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              <HeaderFavoriteButton 
              postId={String(post.id)} 
              initialFavorite={Boolean(post.is_liked)}
              />
              <OptionsMenu 
              postId={String(post.id)}
              ownerId={post.user?.id}
              postType="normal"
             />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <DetailsImage
              src={post.image}
              alt={post.name ?? "Cat"}
              gender={post.gender ?? undefined}
              isAdopted={isAdopted}
              isRescued={isRescued}
              isInjured={!!post.is_injured}
            />

            <CatDetailsInfo cat={catDetailsData} />
          </div>
        </div>

        <CommentsSection postId={String(post.id)} postAuthorId={post.user?.id} /> 

      </div>
    </div>
  );
}

