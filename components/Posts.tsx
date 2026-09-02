"use client";

import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getPosts, Post } from "../lib/api/posts";
import { useAuth } from "@/app/context/AuthContext";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getPosts("NORMAL", token ?? undefined);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [token]);

  return (
    <section className="posts-section" id="latest-posts">
      <div className="posts-container">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-8">
          <Sparkles className="w-[1em] h-[1em] text-pink-300" />
          Latest Posts
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-pink-300 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Cards
                key={post.id} 
                id={post.id}
                image={post.image}
                name={post.name ?? "Unknown"}
                age={post.age ?? 0}
                breed={post.breed?.name ?? "Unknown"}
                city={post.city?.name ?? "Unknown"}
                isLiked={post.is_liked}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
          href="/AllCatPosts"
          className="group inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/50 backdrop-blur-md border border-white/40 text-white font-semibold text-sm md:text-base rounded-full shadow-md hover:shadow-lg drop-shadow-md transition-all duration-300 active:scale-95"
        >
            <span>View All Posts</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
} 