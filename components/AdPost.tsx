import AdCards from "./AdCard";
import { pics } from "../lib/datad";
import { HeartHandshake } from "lucide-react";

export default function AdPost() {
  return (
    <section className="posts-section" id="latest-posts">
      <div className="posts-container">
        <h2 className="posts-title 
        Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2">
          <HeartHandshake className="w-[1em] h-[1em] text-pink-300" />

          Adoption
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pics.map((post) => (
            <AdCards key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
    
  );
} 
