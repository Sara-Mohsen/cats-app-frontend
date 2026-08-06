import RescueCard from "./ResqCard"; // أو اسم المكون حسب مجلدك Cards
import { rescuePics } from "../lib/datar"; // استيراد marray الخاص بالإنقاذ من ملف البيانات
import { ArrowRight, Siren } from "lucide-react";
import Link from "next/link";

export default function RescuePost() {
  return (
    <section className="posts-section">
      <div className="posts-container">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2">
          <Siren className="w-[1em] h-[1em] md:w-10 md:h-10 text-pink-300" />
          Rescue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rescuePics.map((post) => (
            <RescueCard key={post.id} {...post} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href="/AllRescuePosts"
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