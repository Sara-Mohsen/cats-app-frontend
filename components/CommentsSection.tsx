"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Loader2, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { addCommentApi, getCommentsApi, deleteCommentApi, CommentType } from "@/lib/api/posts";

type CommentsSectionProps = {
  postId: string | number;
  postAuthorId?: string | number;
}; 

export default function CommentsSection({ postId, postAuthorId }: CommentsSectionProps) {
  const { token, isAuthenticated, user } = useAuth(); 
  const router = useRouter();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadComments() {
      try {
        setFetching(true);
        const data = await getCommentsApi(postId, token ?? undefined);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setFetching(false);
      }
    }
    if (postId) loadComments();
  }, [postId, token]);

  const handleMention = (username: string) => {
    if (!username) return;
    const mentionText = `@${username} `;
    setNewComment((prev) => (prev.includes(mentionText) ? prev : `${mentionText}${prev}`));
    inputRef.current?.focus();
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated || !token) {
      alert("Please log in first to write a comment! 🐾");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await addCommentApi(postId, newComment, token);
      
      const added: CommentType = res.comment || res.data || {
        id: Date.now(),
        content: newComment,
        created_at: new Date().toISOString(),
        user: { id: user?.id ?? 0, username: user?.username ?? "You", avatar_url: null },
      };

      setComments((prev) => [added, ...prev]);
      setNewComment("");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setDeletingId(commentId);
      await deleteCommentApi(commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Could not delete comment. Please try again.");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  // دالة لتنسيق النص وتلوين الـ Mention بلون وردي فاتح
  const renderCommentContent = (content: string) => {
    const parts = content.split(/(@[a-zA-Z0-9_-]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={index}
            className="inline-block bg-pink-100/80 text-pink-600 font-semibold text-[11px] px-1.5 py-0.5 rounded-md mr-1 border border-pink-200/50"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-5 sm:p-6 transition-all">
      <h3 className="text-sm font-bold text-pink-950 uppercase tracking-wider flex items-center gap-2 mb-4">
        <MessageCircle size={18} className="text-pink-500" />
        <span>Comments ({comments.length})</span>
      </h3>

      <form onSubmit={handleSendComment} className="flex gap-2 mb-5">
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Write a comment..." : "Log in to comment..."}
          className="flex-1 bg-white/80 border border-pink-200 rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-2xl transition shadow-xs flex items-center justify-center active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>

      {fetching ? (
        <div className="flex justify-center py-4 text-pink-400">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const isOwner = user && comment.user && String(user.id) === String(comment.user.id);
            const isPostAuthor = postAuthorId && comment.user && String(comment.user.id) === String(postAuthorId);
            const username = comment.user?.username ?? "Unknown";

            return (
              <div
                key={comment.id}
                className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100 flex items-start justify-between gap-3 relative"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleMention(username)}
                    title={`Mention @${username}`}
                    className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer hover:opacity-80 transition active:scale-90"
                  >
                    {username.charAt(0).toUpperCase()}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 w-full">
                      <div className="flex items-center gap-1.5 min-w-0 shrink">
                        <button
                          type="button"
                          onClick={() => handleMention(username)}
                          title={`Mention @${username}`}
                          className="text-xs font-bold text-pink-900 truncate hover:underline hover:text-pink-600 transition text-left cursor-pointer"
                        >
                          {username}
                        </button>
                        
                        {isPostAuthor && (
                          <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none shrink-0">
                            Author
                          </span>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <span className="text-[10px] text-pink-400">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* هنا يتم عرض النص مع التنسيق الجديد للمنشن */}
                    <p className="text-xs text-gray-700 mt-1 font-medium break-all leading-relaxed">
                      {renderCommentContent(comment.content)}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <div 
                    ref={openMenuId === comment.id ? menuRef : null} 
                    className="flex items-center gap-1 shrink-0 relative"
                  >
                    {openMenuId === comment.id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingId === comment.id}
                        className="bg-white hover:bg-red-50 text-red-500 border border-red-100 shadow-sm px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition cursor-pointer active:scale-95 animate-in fade-in slide-in-from-right-2 duration-150"
                      >
                        {deletingId === comment.id ? (
                          <Loader2 size={12} className="animate-spin shrink-0" />
                        ) : (
                          <Trash2 size={12} className="shrink-0" />
                        )}
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                      className="p-1.5 text-gray-400 hover:text-pink-600 rounded-lg transition"
                      title="Options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}