"use client";

import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type Comment = {
  id: string | number;
  user: string;
  time: string;
  text: string;
};

type CommentsSectionProps = {
  postId?: string | number;
  initialComments?: Comment[];
};

export default function CommentsSection({
  postId,
  initialComments = [
    {
      id: "1",
      user: "Amal",
      time: "2h ago",
      text: "So cute! Is she comfortable around children?",
    },
  ],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const addedComment: Comment = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: newComment,
    };

    setComments((prev) => [addedComment, ...prev]);
    setNewComment("");
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-5 sm:p-6 transition-all">
      <h3 className="text-sm font-bold text-pink-950 uppercase tracking-wider flex items-center gap-2 mb-4">
        <MessageCircle size={18} className="text-pink-500" />
        <span>Comments ({comments.length})</span>
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
          className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-2xl transition shadow-xs flex items-center justify-center active:scale-95 cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {comment.user.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-pink-900">
                  {comment.user}
                </span>
                <span className="text-[10px] text-pink-400">{comment.time}</span>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 font-medium">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
