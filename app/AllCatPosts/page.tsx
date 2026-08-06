"use client";
import React, { useState, useMemo } from "react";
import Cards from "../../components/Cards";
import { pics, CatDetails } from "../../lib/data";
import { Sparkles } from "lucide-react";
import FilterBar, { FilterState } from "../../components/FilterBar";
import Pagination from "../../components/Pagination";

const POSTS_PER_PAGE = 3; // يمكنك تعديل عدد البوستات في الصفحة

const initialFilters: FilterState = {
  search: "",
  breed: "all",
  city: "all",
  gender: "all",
  isNeutered: "all",
};

export default function AllCatPosts() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // استخراج القوائم الديناميكية للفصائل والمدن من البيانات مباشرة
  const uniqueBreeds = useMemo(
    () => Array.from(new Set(pics.map((c) => c.breed))),
    []
  );
  const uniqueCities = useMemo(
    () => Array.from(new Set(pics.map((c) => c.city))),
    []
  );

  // منطق الفلترة المتقدمة
  const filteredCats = useMemo(() => {
    return pics.filter((cat: CatDetails) => {
      // البحث بالنص (الاسم أو الشخصية)
      const matchesSearch =
        filters.search === "" ||
        cat.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        cat.personality.toLowerCase().includes(filters.search.toLowerCase());

      // فلتر الفصيلة
      const matchesBreed =
        filters.breed === "all" || cat.breed === filters.breed;

      // فلتر المدينة
      const matchesCity = filters.city === "all" || cat.city === filters.city;

      // فلتر الجنس
      const matchesGender =
        filters.gender === "all" || cat.gender === filters.gender;

      // فلتر التعقيم
      const matchesNeutered =
        filters.isNeutered === "all" ||
        String(cat.isNeutered) === filters.isNeutered;

      return (
        matchesSearch &&
        matchesBreed &&
        matchesCity &&
        matchesGender &&
        matchesNeutered
      );
    });
  }, [filters]);

  // اعادة تعيين الصفحة إلى 1 عند تغيير أي فلتر
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

  // اقتطاع البيانات حسب رقم الصفحة (Pagination Logic)
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
        {/* عنوان الصفحة */}
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-8">
          <Sparkles className="w-[1em] h-[1em] text-pink-300" />
          All Cats & Posts
        </h2>

        {/* شريط البحث والفلاتر */}
        <FilterBar
          filters={filters}
          setFilters={handleFilterChange}
          breeds={uniqueBreeds}
          cities={uniqueCities}
          onReset={handleReset}
        />

        {/* عرض الشبكة أو رسالة عدم وجود نتائج */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <Cards key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg">
            🐾 No cats found matching your search options! Try resetting filters.
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
