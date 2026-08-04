import RescueCard from "./ResqCard"; // أو اسم المكون حسب مجلدك Cards
import { rescuePics } from "../lib/datar"; // استيراد marray الخاص بالإنقاذ من ملف البيانات
import { Siren } from "lucide-react";

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
      </div>
    </section>
  );
}