import Cards from "./Cards";
import { pics } from "../lib/data";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Posts() {
  return (
    <section className="posts-section" id="latest-posts">
      <div className="posts-container">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-8">
          <Sparkles className="w-[1em] h-[1em] text-pink-300" />
          Latest Posts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pics.map((post) => (
            <Cards key={post.id} {...post} />
          ))}
        </div>

        {/* زر الانتقال لصفحة All Cat Posts */}
        <div className="flex justify-center mt-10">
          <Link
            href="/AllCatPosts"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/50 backdrop-blur-md border border-white/40 text-white font-semibold text-sm md:text-base rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            <span>View All Posts</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
