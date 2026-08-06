"use client";
import React, { useState, useMemo } from "react";
import Cards from "../../components/ResqCard"; // الكومبوننت الرئيسي الخاص بك
import { rescuePics, RescueDetails } from "../../lib/datar";
import { Siren } from "lucide-react";
import RescueFilterBar, { RescueFilterState } from "../../components/RescueFilterBar";
import Pagination from "../../components/Pagination";

const POSTS_PER_PAGE = 3;

const initialFilters: RescueFilterState = {
  search: "",
  city: "all",
  isInjured: "all",
  isRescued: "all",
};

export default function AllRescuePosts() {
  const [filters, setFilters] = useState<RescueFilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // استخراج المدن المتاحة تلقائياً من بيانات الإنقاذ
  const uniqueCities = useMemo(
    () => Array.from(new Set(rescuePics.map((c) => c.city))),
    []
  );

  // منطق تصفية حالات الإنقاذ
  const filteredRescues = useMemo(() => {
    return rescuePics.filter((rescue: RescueDetails) => {
      const searchTerm = filters.search.toLowerCase().trim();

      // البحث برقم الـ ID، الصيغة المنسقة (formattedId)، أو وصف الإصابة
      const matchesSearch =
        searchTerm === "" ||
        String(rescue.id).includes(searchTerm) ||
        rescue.formattedId.toLowerCase().includes(searchTerm) ||
        (rescue.injuryDescription &&
          rescue.injuryDescription.toLowerCase().includes(searchTerm));

      // فلتر المدينة
      const matchesCity =
        filters.city === "all" || rescue.city === filters.city;

      // فلتر الإصابة (مصاب / سليم)
      const matchesInjured =
        filters.isInjured === "all" ||
        String(rescue.isInjured) === filters.isInjured;

      // فلتر الإنقاذ (تم إنقاذه / لم يتم بعد)
      const matchesRescued =
        filters.isRescued === "all" ||
        String(rescue.isRescued) === filters.isRescued;

      return (
        matchesSearch && matchesCity && matchesInjured && matchesRescued
      );
    });
  }, [filters]);

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

  // اقتطاع البيانات حسب الـ Pagination
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
        {/* عنوان الصفحة */}
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-4">
          <Siren className="w-[1em] h-[1em] text-pink-300 animate-pulse" />
          Rescue Cases
        </h2>

        {/* شريط البحث والفلاتر المخصص للإنقاذ */}
        <RescueFilterBar
          filters={filters}
          setFilters={handleFilterChange}
          cities={uniqueCities}
          onReset={handleReset}
        />

        {/* شبكة البوستات أو رسالة عدم العثور */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <Cards key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg shadow-sm">
            🚨 No rescue cases found matching your search.
          </div>
        )} 

        {/* الترقيم العصري */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
