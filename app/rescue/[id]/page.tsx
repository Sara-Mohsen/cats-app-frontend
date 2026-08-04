"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRescueById } from "@/lib/datar";
import {
  ArrowLeft,
  MapPin,
  Phone,
  AlertTriangle,
  MessageCircle,
  Send,
  HeartHandshake,
  ShieldAlert,
  Heart,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle, // 👈 تم استيراد أيقونة الصح
} from "lucide-react";

export default function RescueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rescueData = getRescueById(resolvedParams.id);

  const [newComment, setNewComment] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (!rescueData) {
    return (
      <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-pink-950 mb-2">Case Not Found</h2>
          <p className="text-gray-600 text-sm mb-4">Rescue case could not be found.</p>
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

  const handleDelete = () => {
    setShowMenu(false);
    if (confirm("Are you sure you want to delete this rescue post?")) {
      alert("Post deleted successfully.");
      // أضف هنا كود الحذف الخاص بك (مثلاً التوجيه إلى الصفحة الرئيسية)
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    alert("Redirecting to edit form...");
    // توجيه لصفحة التعديل إن وجدت: router.push(`/rescue/${rescueData.id}/edit`)
  };

  // 👈 دالة لتحديد البوست كـ Rescued من القائمة المنسدلة
  const handleMarkAsRescued = () => {
    setShowMenu(false);
    alert(`${formattedId} has been marked as rescued! 🎉`);
    // أضف هنا كود التحديث الخاص بك في قاعدة البيانات
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    console.log("Comment submitted:", newComment);
    setNewComment("");
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl my-6 space-y-5">
        
        {/* بطاقة التفاصيل الرئيسية */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
          <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

          {/* شريط التحكم العلوي */}
          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between relative">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>

            {/* أدوات التحكم (المفضلة والقائمة المنسدلة) */}
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

                  <div className="absolute top-12 right-0 z-20 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center gap-2.5 transition"
                    >
                      <Pencil size={16} className="text-pink-400" />
                      <span>Edit Post</span>
                    </button>
                    {/* 👈 الخيار الثالث: Mark as Rescued */}
                    <button
                      onClick={handleMarkAsRescued}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 transition"
                    >
                      <Heart size={16} className="text-purple-500" />
                      <span>Mark as Rescued</span>
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

          <div className="p-4 sm:p-6 md:p-8">
            {/* الصورة والبصمة التحذيرية أو شارة الإنقاذ */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-pink-100 mb-6 group">
              <Image
                src={rescueData.image}
                alt={formattedId}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              {/* 👈 شارة Rescued بدلاً من Urgent عند الانقاذ، ونفس اللون بنفسجي */}
              {rescueData.isRescued ? (
                <span className="absolute top-4 left-4 bg-purple-100/90 backdrop-blur-md text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-purple-300/40 flex items-center gap-1.5 animate-in fade-in duration-300 z-10">
                  <CheckCircle size={15} className="text-purple-800" />
                  <span>Cat Rescued!</span>
                </span>
              ) : rescueData.isInjured && (
                <span className="absolute top-4 left-4 bg-pink-100/60 backdrop-blur-md text-pink-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle size={14} />
                  <span>Urgent Medical Attention</span>
                </span>
              )}
            </div>

            {/* المعرف والمدينة */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-pink-950 flex items-center gap-2">
                  {formattedId}
                </h1>
                <div className="flex items-center gap-2 text-pink-600 font-medium text-sm mt-1">
                  <MapPin size={16} className="text-pink-400" />
                  <span>{rescueData.city}</span>
                </div>
              </div>
            </div>

            {/* التفاصيل الإضافية */}
            <div className="space-y-4 mb-6">
              {/* حالة الإصابة */}
              <div className="bg-white/70 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      rescueData.isInjured
                        ? "text-purple-600 bg-purple-100 border-purple-100"
                        : "text-gray-600 bg-gray-100 border-gray-200"
                    }`}
                  >
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Condition
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {rescueData.isInjured
                        ? "Injured / Needs Care"
                        : "Healthy / Safe"}
                    </p>
                  </div>
                </div>
              </div>

              {/* وصف الإصابة */}
              {rescueData.isInjured && rescueData.injuryDescription && (
                <div className="bg-purple-100/70 border border-purple-100 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={16} className="text-purple-500" />
                    <span>Injury Description</span>
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {rescueData.injuryDescription}
                  </p>
                </div>
              )}

              {/* رقم التواصل */}
              <div className="bg-white/70 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                      Contact Number
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {rescueData.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* زر الانقاذ */}
            <button
              onClick={handleRescueAction}
              className="w-full py-4 px-6 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <HeartHandshake size={20} />
              <span>Rescue This Cat</span>
            </button>
          </div>
        </div>

        {/* قسم التعليقات */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-5 sm:p-6 transition-all">
          <h3 className="text-sm font-bold text-pink-950 uppercase tracking-wider flex items-center gap-2 mb-4">
            <MessageCircle size={18} className="text-pink-500" />
            <span>Rescue Comments</span>
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
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-pink-900">Sara</span>
                  <span className="text-[10px] text-pink-400">10m ago</span>
                </div>
                <p className="text-xs text-gray-700 mt-0.5 font-medium">
                  I can provide temporary shelter if someone can transport the cat!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}