"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import "../styles/dashboard.css";
import "../styles/dash-nav.css";
import DashNav from "../../components/DashNav";
import Pagination from "../../components/Pagination";
import { useAuth } from "../context/AuthContext";

interface FavoritePost {
  id: string;
  image: string;
  alt: string;
  postType: string;
}

interface FavoriteItem {
  id: string | number;
  title?: string;
  name?: string;
  post_type?: string;
  type?: string;
  image?: string;
  image_url?: string;
  images?: Array<{
    image_url?: string;
    url?: string;
    path?: string;
  }>;
}

const ITEMS_PER_PAGE = 8;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function FavoritePage() {
  const router = useRouter();
  const { token: authContextToken } = useAuth();

  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      const token = authContextToken || localStorage.getItem("auth_token") || localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : data.data || data.posts || [];

        const formattedFavorites: FavoritePost[] = rawList.map((item: FavoriteItem) => {
          let imageUrl = "/images/Cats/pic1.png"; 

          if (item.images && item.images.length > 0) {
            const imgPath = item.images[0].image_url || item.images[0].url || item.images[0].path;
            if (imgPath) {
              imageUrl = imgPath.startsWith("http") ? imgPath : `${API_BASE_URL}/storage/${imgPath}`;
            }
          } else if (item.image) {
            imageUrl = item.image.startsWith("http") ? item.image : `${API_BASE_URL}/storage/${item.image}`;
          } else if (item.image_url) {
            imageUrl = item.image_url.startsWith("http") ? item.image_url : `${API_BASE_URL}/storage/${item.image_url}`;
          }

          return {
            id: String(item.id),
            image: imageUrl,
            alt: item.title || item.name || `Favorite Cat ${item.id}`,
            postType: String(item.post_type || item.type || "adoption").toLowerCase(),
          };
        });

        setFavorites(formattedFavorites);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setError("Failed to load favorite posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [authContextToken, router]);

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const currentPosts = favorites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPostLink = (id: string, postType: string) => {
    if (postType.includes("rescue")) {
      return `/rescue/${id}`;
    }
    return `/details/${id}`;
  };

  if (loading) {
    return (
      <div className="dashboard-container min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={36} />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen">
      <DashNav />

      <main className="dashboard-main-content" id="all-posts-section">
        <div className="w-full">
          <div className="card w-full">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                <Heart className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={28} />
                <span>Favorite Posts</span>
              </h2>
              <p className="text-sm text-pink-900/60 mt-1">
                Your saved cat posts all in one place.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-pink-100 border border-pink-300 text-pink-950 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            {currentPosts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={getPostLink(post.id, post.postType)}
                    className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-pink-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        View post
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-pink-900/60">
                <Heart className="mx-auto mb-3 opacity-40" size={48} />
                <p>No favorite posts saved yet.</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )} 
          </div>
        </div>
      </main>
    </div>
  );
}