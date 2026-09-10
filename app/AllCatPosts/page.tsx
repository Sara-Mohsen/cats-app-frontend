"use client";

import React, { useState, useEffect, useMemo } from "react";
import Cards from "../../components/Cards";
import { Sparkles, Loader2 } from "lucide-react";
import FilterBar, { FilterState } from "../../components/FilterBar";
import Pagination from "../../components/Pagination";
import { getPosts, Post } from "@/lib/api/posts";
import { useAuth } from "@/app/context/AuthContext"; 

const POSTS_PER_PAGE = 6; 

const initialFilters: FilterState = {
  search: "",
  breed: "all",
  city: "all",
  gender: "all",
  isNeutered: "all",
};

export default function AllCatPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getPosts("NORMAL", token ?? undefined);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [token]);

  const uniqueBreeds = useMemo(() => {
    const breeds = posts
      .map((p) => p.breed?.name)
      .filter((b): b is string => Boolean(b));
    return Array.from(new Set(breeds));
  }, [posts]);

  const uniqueCities = useMemo(() => {
    const cities = posts
      .map((p) => p.city?.name)
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(cities));
  }, [posts]);

  const filteredCats = useMemo(() => {
    return posts.filter((cat) => {
      const catName = cat.name ?? "";
      const catPersonality = cat.personality ?? "";
      const matchesSearch =
        filters.search === "" ||
        catName.toLowerCase().includes(filters.search.toLowerCase()) ||
        catPersonality.toLowerCase().includes(filters.search.toLowerCase());

      const matchesBreed =
        filters.breed === "all" || cat.breed?.name === filters.breed;

      const matchesCity = 
        filters.city === "all" || cat.city?.name === filters.city;

      const matchesGender =
        filters.gender === "all" || cat.gender === filters.gender;

      const matchesNeutered =
        filters.isNeutered === "all" ||
        String(cat.is_neutered) === filters.isNeutered;

      return (
        matchesSearch &&
        matchesBreed &&
        matchesCity &&
        matchesGender &&
        matchesNeutered
      );
    });
  }, [posts, filters]);

  const handleFilterChange = (
    newFilters: React.SetStateAction<FilterState>
  ) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCats.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredCats.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredCats, currentPage]);

  return (
    <section
      className="posts-section pt-64 md:pt-64 pb-12 px-4 min-h-screen"
      id="all-posts-section"
    >
      <div className="posts-container max-w-7xl mx-auto">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-8">
          <Sparkles className="w-[1em] h-[1em] text-pink-300" />
          All Cats & Posts
        </h2>

        <FilterBar
          filters={filters}
          setFilters={handleFilterChange}
          breeds={uniqueBreeds}
          cities={uniqueCities}
          onReset={handleReset}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-pink-300 mb-3" />
            <p className="text-lg font-medium">Loading cats...</p>
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <Cards
                key={post.id}
                id={post.id}
                name={post.name ?? "Unknown"}
                breed={post.breed?.name ?? "Unknown"}
                age={post.age ? `${post.age} Years` : "N/A"}
                city={post.city?.name ?? "Unknown"}
                image={post.image}
                isLiked={post.is_liked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg">
            🐾 No cats found matching your search options! Try resetting filters.
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}