"use client";

import React, { useState, useEffect, useMemo } from "react";
import RescueCard from "../../components/ResqCard"; 
import { Siren, Loader2 } from "lucide-react";
import RescueFilterBar, { RescueFilterState } from "../../components/RescueFilterBar";
import Pagination from "../../components/Pagination";
import { getPosts, Post } from "@/lib/api/posts";
import { useAuth } from "@/app/context/AuthContext";

const POSTS_PER_PAGE = 6;

const initialFilters: RescueFilterState = {
  search: "",
  city: "all",
  isInjured: "all",
  isRescued: "all",
}; 

export default function AllRescuePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<RescueFilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useAuth();

  useEffect(() => {
    async function fetchRescuePosts() {
      try {
        setLoading(true);
        const data = await getPosts("RESCUE", token ?? undefined);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching rescue posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRescuePosts();
  }, [token]);

  const uniqueCities = useMemo(() => {
    const cities = posts
      .map((p) => p.city?.name)
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(cities));
  }, [posts]);

  const filteredRescues = useMemo(() => {
    return posts.filter((rescue) => {
      const searchTerm = filters.search.toLowerCase().trim();
      const rescueIdStr = String(rescue.id);
      const injuryDesc = rescue.injury_description?.toLowerCase() ?? "";

      const matchesSearch =
        searchTerm === "" ||
        rescueIdStr.includes(searchTerm) ||
        injuryDesc.includes(searchTerm);

      const matchesCity =
        filters.city === "all" || rescue.city?.name === filters.city;

      const matchesInjured =
        filters.isInjured === "all" ||
        String(rescue.is_injured ?? false) === filters.isInjured;

      const isRescuedBool = rescue.status === "CLOSED";
      const matchesRescued =
        filters.isRescued === "all" ||
        String(isRescuedBool) === filters.isRescued;

      return (
        matchesSearch && matchesCity && matchesInjured && matchesRescued
      );
    });
  }, [posts, filters]);

  const handleFilterChange = (
    newFilters: React.SetStateAction<RescueFilterState>
  ) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRescues.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredRescues.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredRescues, currentPage]);

  return (
    <section
      className="posts-section pt-64 md:pt-64 pb-12 px-4 min-h-screen"
      id="rescue-posts-section"
    >
      <div className="posts-container max-w-7xl mx-auto">
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-4">
          <Siren className="w-[1em] h-[1em] text-pink-300 animate-pulse" />
          Rescue Cases
        </h2>

        <RescueFilterBar
          filters={filters}
          setFilters={handleFilterChange}
          cities={uniqueCities}
          onReset={handleReset}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-pink-300 mb-3" />
            <p className="text-lg font-medium">Loading rescue cases...</p>
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <RescueCard
                key={post.id}
                id={post.id}
                image={post.image}
                city={post.city?.name ?? "Unknown"}
                isInjured={post.is_injured ?? false}
                isRescued={post.status === "CLOSED"}
                isLiked={post.is_liked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg shadow-sm">
            🚨 No rescue cases found matching your search.
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