"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdCards from "../../components/AdCard";
import { Heart, Loader2 } from "lucide-react";
import AdoptionFilterBar, { AdoptionFilterState } from "../../components/AdoptionFilterBar";
import Pagination from "../../components/Pagination";
import { getPosts, Post } from "@/lib/api/posts";
import { useAuth } from "@/app/context/AuthContext";

const POSTS_PER_PAGE = 6;

const initialFilters: AdoptionFilterState = {
  search: "",
  breed: "all",
  city: "all",
  gender: "all",
  isNeutered: "all",
  isAdopted: "all",
};

export default function AllAdoptionPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<AdoptionFilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useAuth();

  useEffect(() => {
    async function fetchAdoptionPosts() {
      try {
        setLoading(true);
        const data = await getPosts("ADOPTION", token ?? undefined);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching adoption posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdoptionPosts();
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
      const searchTerm = filters.search.toLowerCase().trim();
      const catName = cat.name ?? "";
      const catPersonality = cat.personality ?? "";
      const breedName = cat.breed?.name ?? "";

      const matchesSearch =
        searchTerm === "" ||
        catName.toLowerCase().includes(searchTerm) ||
        breedName.toLowerCase().includes(searchTerm) ||
        catPersonality.toLowerCase().includes(searchTerm);

      const matchesBreed =
        filters.breed === "all" || cat.breed?.name === filters.breed;

      const matchesCity =
        filters.city === "all" || cat.city?.name === filters.city;

      const matchesGender =
        filters.gender === "all" || cat.gender === filters.gender;

      const matchesNeutered =
        filters.isNeutered === "all" ||
        String(cat.is_neutered) === filters.isNeutered;

      const isAdoptedBool = cat.status === "CLOSED";
      const matchesAdopted =
        filters.isAdopted === "all" ||
        String(isAdoptedBool) === filters.isAdopted;

      return (
        matchesSearch &&
        matchesBreed &&
        matchesCity &&
        matchesGender &&
        matchesNeutered &&
        matchesAdopted
      );
    });
  }, [posts, filters]);

  const handleFilterChange = (
    newFilters: React.SetStateAction<AdoptionFilterState>
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
      id="adoption-posts-section"
    >
      <div className="posts-container max-w-7xl mx-auto">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-4">
          <Heart className="w-[1em] h-[1em] text-pink-300 fill-pink-300 animate-bounce" />
          Cats For Adoption
        </h2>

        <AdoptionFilterBar
          filters={filters}
          setFilters={handleFilterChange}
          breeds={uniqueBreeds}
          cities={uniqueCities}
          onReset={handleReset}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-pink-300 mb-3" />
            <p className="text-lg font-medium">Loading adoption posts...</p>
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <AdCards
                key={post.id}
                id={post.id}
                image={post.image}
                name={post.name ?? "Unknown"}
                age={post.age ?? 0}
                breed={post.breed?.name ?? "Unknown"}
                city={post.city?.name ?? "Unknown"}
                isAdopted={post.status === "CLOSED"}
                isLiked={post.is_liked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg shadow-sm">
            🐱 No cats found matching your adoption search criteria.
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