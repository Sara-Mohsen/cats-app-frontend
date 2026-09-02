"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { deletePostApi, updatePostStatusApi } from "@/lib/api/posts";

type OptionsMenuProps = {
  postId: string | number;
  ownerId?: number;
  postType: "normal" | "adoption" | "rescue";
  isDone?: boolean;
  onToggleStatus?: (newStatus: boolean) => void;
  onDeleteSuccess?: () => void;
};

export default function OptionsMenu({
  postId,
  ownerId,
  postType,
  isDone = false,
  onToggleStatus, 
  onDeleteSuccess,
}: OptionsMenuProps) {
  const { user, token } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isOwner = user && ownerId && Number(user.id) === Number(ownerId);

  if (!isOwner) {
    return null; 
  }
 
  const handleEdit = () => {
    setShowMenu(false);
    router.push(`/edit/${postId}?type=${postType}`);
  };

  const handleToggleStatus = async () => {
    setShowMenu(false);
    const newIsDone = !isDone;
    const statusValue: "ACTIVE" | "CLOSED" = newIsDone ? "CLOSED" : "ACTIVE"; 

    try {
      setLoading(true);

      if (token) {
        await updatePostStatusApi(postId, statusValue, token); 
      }

      if (onToggleStatus) {
        onToggleStatus(newIsDone);
      }

      const statusText =
        postType === "rescue"
          ? newIsDone ? "Rescued! 🎉" : "Unrescued"
          : newIsDone ? "Adopted! 🎉" : "Unadopted";

      alert(`Post marked as ${statusText}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      if (token) {
        await deletePostApi(postId, token);
        alert("Post deleted successfully!");
        if (onDeleteSuccess) onDeleteSuccess();
        else router.push("/");
      }
    } catch (error) {
      alert("Failed to delete post.");
    }
  };

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
            <button
              onClick={handleEdit}
              disabled={loading}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center gap-2.5 transition disabled:opacity-50"
            >
              <Pencil size={16} className="text-pink-400" />
              <span>Edit Post</span>
            </button>

            {postType !== "normal" && (
              <button
                onClick={handleToggleStatus}
                disabled={loading}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition disabled:opacity-50 ${
                  isDone
                    ? "text-pink-600 hover:bg-pink-50" 
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

            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition border-t border-pink-50 mt-1 pt-2.5 disabled:opacity-50"
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