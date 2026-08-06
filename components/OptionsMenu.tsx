"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, CheckCircle2, RotateCcw } from "lucide-react";

type OptionsMenuProps = {
  postId: string | number;
  postType: "normal" | "adoption" | "rescue";
  isDone?: boolean; // isAdopted أو isRescued
  onToggleStatus?: (newStatus: boolean) => void;
  onDeleteSuccess?: () => void;
};

export default function OptionsMenu({
  postId,
  postType,
  isDone = false,
  onToggleStatus,
  onDeleteSuccess,
}: OptionsMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. التوجيه لصفحة التعديل مع نوع البوست والـ ID
  const handleEdit = () => {
  setShowMenu(false);
  // التوجيه لصفحة التعديل الصريحة مع تمرير الـ ID والـ Type
  router.push(`/edit/${postId}?type=${postType}`);
};


  // 2. التبديل بين حالة التبني/الإنقاذ وإلغائها
  const handleToggleStatus = async () => {
    setShowMenu(false);
    const newStatus = !isDone;

    try {
      // 👈 هنا يتم إرسال الطلب لقاعدة البيانات مستقبلاً
      // await fetch(`/api/posts/${postId}`, { method: 'PATCH', body: JSON.stringify({ isDone: newStatus }) });
      
      if (onToggleStatus) onToggleStatus(newStatus);

      const statusText =
        postType === "rescue"
          ? newStatus ? "Rescued! 🎉" : "Unrescued"
          : newStatus ? "Adopted! 🎉" : "Unadopted";

      alert(`Post marked as ${statusText}`);
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // 3. الحذف مع جهوزية الربط بقاعدة البيانات
  const handleDelete = async () => {
    setShowMenu(false);
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      // 👈 هنا يتم إرسال طلب الحذف لقاعدة البيانات مستقبلاً
      // await fetch(`/api/posts/${postId}`, { method: 'DELETE' });

      alert("Post deleted successfully!");
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        router.push("/"); // العودة للرئيسية
      }
    } catch (error) {
      alert("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  // مسميات الزر بناءً على نوع البوست والحالة الحالية
  const statusLabel =
    postType === "rescue"
      ? isDone ? "Mark as Unrescued" : "Mark as Rescued"
      : isDone ? "Mark as Unadopted" : "Mark as Adopted";

  return (
    <div className="relative">
      <button
        type="button"
        disabled={loading}
        onClick={() => setShowMenu((prev) => !prev)}
        className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-pink-100 transition shadow-xs flex items-center justify-center text-pink-500 hover:text-pink-700 active:scale-95 cursor-pointer disabled:opacity-50"
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
            {/* ✏️ التعديل */}
            <button
              onClick={handleEdit}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center gap-2.5 transition"
            >
              <Pencil size={16} className="text-pink-400" />
              <span>Edit Post</span>
            </button>

            {/* 🎀 زر التغيير الديناميكي (يتغير للون الوردي عند الإلغاء) */}
            {postType !== "normal" && (
              <button
                onClick={handleToggleStatus}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition ${
                  isDone
                    ? "text-pink-600 hover:bg-pink-50" // لون زهري عند الإلغاء
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                {isDone ? (
                  <RotateCcw size={16} className="text-pink-500" />
                ) : (
                  <CheckCircle2 size={16} className="text-purple-500" />
                )}
                <span>{statusLabel}</span>
              </button>
            )}

            {/* 🗑️ الحذف */}
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition border-t border-pink-50 mt-1 pt-2.5"
            >
              <Trash2 size={16} className="text-red-500" />
              <span>Delete Post</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
