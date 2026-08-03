"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCatById } from "@/lib/datad"; // 👈 استيراد دالة البيانات

import {
  ArrowLeft,
  PawPrint,
  Cake,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Syringe,
  Cat,
  Heart,
  MoreVertical,
  Pencil,
  Trash2,
  MessageCircle,
  Send,
  Sparkles,
  Phone, // 👈 تم استيراد أيقونة الهاتف
} from "lucide-react";

export default function CatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // فك الـ params للحصول على الـ id في Next.js 15+
  const resolvedParams = use(params);
  const cat = getCatById(resolvedParams.id);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");

  // في حال لم يتم العثور على العنصر
  if (!cat) {
    return (
      <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4">
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

  const handleEdit = () => {
    setShowMenu(false);
    console.log("Edit post:", cat.id);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (confirm("Are you sure you want to delete this post?")) {
      console.log("Delete post:", cat.id);
    }
  };

  const handleAdopt = () => {
    alert(`Thank you for your interest in adopting ${cat.name}! 🐾`);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    console.log("New comment sent:", newComment);
    setNewComment("");
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          {/* Header Bar */}
          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between relative">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setIsFavorite((prev) => !prev)}
                className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-pink-100 transition shadow-xs flex items-center justify-center active:scale-95"
                aria-label="Add to Favorites"
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

              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-pink-100 transition shadow-xs flex items-center justify-center text-pink-500 hover:text-pink-700 active:scale-95"
                aria-label="More Options"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  <div className="absolute top-12 right-0 z-20 w-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center gap-2.5 transition"
                    >
                      <Pencil size={16} className="text-pink-400" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition"
                    >
                      <Trash2 size={16} className="text-red-500" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-pink-100 mb-6 group">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white">
                {cat.gender === "Male" ? "♂ Male" : "♀ Female"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-pink-950 flex items-center gap-2">
                  {cat.name}
                </h1>
                <div className="flex items-center gap-2 text-pink-600 font-medium text-sm mt-1">
                  <MapPin size={16} className="text-pink-400" />
                  <span>{cat.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-pink-800 text-xs font-semibold px-3 py-1.5 rounded-xl">
                  <PawPrint size={14} className="text-pink-500" />
                  {cat.breed}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-xl">
                  <Cake size={14} className="text-purple-500" />
                  {cat.age}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <PawPrint size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Breed</p>
                  <p className="text-sm font-bold text-gray-800">{cat.breed}</p>
                </div>
              </div>

              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <Cake size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Age</p>
                  <p className="text-sm font-bold text-gray-800">{cat.age}</p>
                </div>
              </div>

              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">City</p>
                  <p className="text-sm font-bold text-gray-800">{cat.city}</p>
                </div>
              </div>

              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <Cat size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Gender</p>
                  <p className="text-sm font-bold text-gray-800">{cat.gender}</p>
                </div>
              </div>

              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Neutered</p>
                  <p className="text-sm font-bold text-gray-800">
                    {cat.isNeutered ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                  <Syringe size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Vaccinated</p>
                  <p className="text-sm font-bold text-gray-800">
                    {cat.isVaccinated ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* 👈 إضافة خانة رقم الهاتف */}
              {cat.phone && (
                <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3 col-span-2 sm:col-span-3">
                  <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                      Owner Contact
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {cat.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-pink-50/60 border border-pink-100 rounded-2xl p-4 sm:p-5 mb-6">
              <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                <HeartHandshake size={18} className="text-pink-500" />
                <span>Personality & Description</span>
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {cat.personality}
              </p>
            </div>

            <button
              onClick={handleAdopt}
              className="w-full py-4 px-6 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              <span>Adopt {cat.name}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-5 sm:p-6 transition-all">
          <h3 className="text-sm font-bold text-pink-950 uppercase tracking-wider flex items-center gap-2 mb-4">
            <MessageCircle size={18} className="text-pink-500" />
            <span>Comments</span>
          </h3>

          <form onSubmit={handleSendComment} className="flex gap-2 mb-5">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/80 border border-pink-200 rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-2xl transition shadow-xs flex items-center justify-center active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="space-y-3">
            <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-pink-900">Reem</span>
                  <span className="text-[10px] text-pink-400">1w ago</span>
                </div>
                <p className="text-xs text-gray-700 mt-0.5 font-medium">
                  Aww, Lucy looks so adorable! I hope she finds a loving home soon. 🐾
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
