"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getPostById, Post, sendAdoptionRequestApi, getAdoptionRequestStatusApi, } from "@/lib/api/posts";
import { useRouter } from "next/navigation"; 
import HeaderFavoriteButton from "../../../components/HeaderFavoriteButton";
import OptionsMenu from "../../../components/OptionsMenu";
import DetailsImage from "../../../components/DetailsImage";
import CatDetailsInfo from "../../../components/CatDetailsInfo";
import CommentsSection from "../../../components/CommentsSection";
import { useAuth } from "@/app/context/AuthContext";

export default function AdoptionDetailsPage({
  params,
}: { 
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const { token, user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdopted, setIsAdopted] = useState<boolean>(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
  async function fetchCat() {
    try {
      setLoading(true);

      const data = await getPostById(
        resolvedParams.id,
        token ?? undefined
      );

      if (data) {
        setPost(data);
        setIsAdopted(data.status === "CLOSED");

        if (token) {
          try {
            const requestStatus = await getAdoptionRequestStatusApi(
              data.id,
              token
            );

            setIsRequestSent(
              requestStatus.has_request &&
              requestStatus.status === "PENDING"
            );
          } catch (error) {
            console.error(
              "Error fetching adoption request status:",
              error
            );
          }
        }
      }
    } catch (err) {
      console.error("Error fetching cat details:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchCat();
}, [resolvedParams.id, token]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <p className="text-white text-lg font-bold">Loading...</p>
      </div>
    );
  }

  if (!post) {
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

  const handleAdopt = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (requestLoading || isRequestSent || isAdopted) {
      return;
    }

    setRequestLoading(true);

    try {
      await sendAdoptionRequestApi(post.id, token);

      setIsRequestSent(true);

      alert(
        `Your adoption request for ${post.name || "this cat"} has been sent successfully! 🐾`
      );
    } catch (error) {
      console.error("Error sending adoption request:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to send adoption request.";

      alert(message);
    } finally {
      setRequestLoading(false);
    }
  };

  const formattedCatData = {
    name: post.name ?? "Unknown Cat",
    city: post.city?.name ?? "Unknown",
    breed: post.breed?.name ?? "Unknown",
    age: post.age ?? "N/A",
    gender: post.gender ?? "Unknown",
    isNeutered: post.is_neutered,
    isVaccinated: post.is_vaccinated,
    personality: post.personality,
    phone: post.contact_number,
  };

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
                postType="adoption"
                isDone={isAdopted}
                onToggleStatus={(newStatus) => setIsAdopted(newStatus)}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <DetailsImage
              src={post.image}
              alt={post.name ?? "Cat"}
              gender={post.gender ?? "UNKNOWN"}
              isAdopted={isAdopted}
            />

            <CatDetailsInfo cat={formattedCatData} />

            {!isOwner && (
              <button
                onClick={handleAdopt}
                disabled={isAdopted || isRequestSent || requestLoading}
                className={`w-full py-4 px-6 font-bold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 ${
                  isAdopted || isRequestSent || requestLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white hover:shadow-xl transform active:scale-[0.98] cursor-pointer"
                }`}
               >
                <Sparkles size={20} />

                <span>
                  {isAdopted
                    ? "Already Adopted"
                    : isRequestSent
                    ? "Request Sent"
                    : requestLoading
                    ? "Sending..."
                    : `Adopt ${post.name ?? "Cat"}`}
                </span>
              </button>
            )}
          </div>
        </div>
 
        <CommentsSection postId={post.id} postAuthorId={post.user?.id} />

      </div>
    </div>
  );
}