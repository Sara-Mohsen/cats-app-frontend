import Cards from "./ResqCard";
import { pics } from "../lib/datar";
import { Siren } from "lucide-react";
export default function Posts() {
  return (
    <section className="posts-section">
      <div className="posts-container">
        <h2 className="postq-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2">
        <Siren className="w-[1em] h-[1em] md:w-10 md:h-10 text-red-300" />
          Rescue Cats
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pics.map((post) => (
            <Cards key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
    
  );
}
