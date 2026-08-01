import Cards from "./Cards";
import { pics } from "../lib/data";

export default function Posts() {
  return (
    <section className="posts-section">
      <div className="posts-container">
        <h2 className="posts-title 
        text-4xl md:text-5xl font-extrabold text-white">
          Latest Posts
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
