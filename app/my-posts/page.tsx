"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Images, Loader2 } from "lucide-react";
import DashNav from "../../components/DashNav";
import Pagination from "../../components/Pagination";
import { useAuth } from "../context/AuthContext";

interface MyPost {
  id: string;
  image: string;
  alt: string;
  postType: string;
}
 
interface RawPost {
  id?: string | number;
  image_url?: string;
  image?: string;
  images?: Array<{
    image_url?: string;
    url?: string;
    path?: string;
  }>;
  name?: string;
  title?: string;
  post_type?: string;
  type?: string;
}

const ITEMS_PER_PAGE = 8;
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_BASE_URL = API_URL.replace(/\/api$/, "");

export default function MyPostsPage() {
  const router = useRouter();
  const { token: authContextToken } = useAuth();

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStorageUrl = (path?: string | null) => {
  if (!path || path === "null" || path === "undefined") {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\/+/, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
};

  useEffect(() => {
    async function fetchMyPosts() {
      const token =
        authContextToken ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/my-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Backend Error Details:", response.status, errData);
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : data.data || data.posts || [];

        const formattedPosts: MyPost[] = rawList.map((item: RawPost) => {
          let imageUrl = "/images/Cats/pic1.png"; 

          if (item.image_url) {
            imageUrl = item.image_url.startsWith("http")
              ? item.image_url
              : getStorageUrl(item.image_url) || "/images/Cats/pic1.png";
          } else if (item.image) {
            imageUrl = item.image.startsWith("http")
              ? item.image
              : getStorageUrl(item.image) || "/images/Cats/pic1.png";
          } else if (item.images && item.images.length > 0) {
            const imgPath =
              item.images[0].image_url ||
              item.images[0].url ||
              item.images[0].path;
            if (imgPath) {
              imageUrl = imgPath.startsWith("http")
                ? imgPath
                : getStorageUrl(imgPath) || "/images/Cats/pic1.png";
            }
          }

          return {
            id: String(item.id),
            image: imageUrl,
            alt: item.name || item.title || `My Cat Post ${item.id}`,
            postType: String(item.post_type || item.type || "adoption").toLowerCase(),
          };
        });

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error loading my posts:", err);
        setError("Failed to load your posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyPosts();
  }, [authContextToken, router]);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const currentPosts = posts.slice(
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
                <Images className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={28} />
                <span>My Posts</span>
              </h2>
              <p className="text-sm text-pink-900/60 mt-1">
                A simplified view of all your submitted cat posts.
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
                <Images className="mx-auto mb-3 opacity-40" size={48} />
                <p>You haven&apos;t submitted any posts yet.</p>
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