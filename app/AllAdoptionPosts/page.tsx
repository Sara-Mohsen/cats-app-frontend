"use client";
import React, { useState, useMemo } from "react";
import Cards from "../../components/Cards";
import { pics, CatDetails } from "../../lib/datad"; // استدعاء داتا التبني الخاصة بك
import { Heart } from "lucide-react";
import AdoptionFilterBar, { AdoptionFilterState } from "../../components/AdoptionFilterBar";
import Pagination from "../../components/Pagination";

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
  const [filters, setFilters] = useState<AdoptionFilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // استخراج القوائم الديناميكية للفصائل والمدن
  const uniqueBreeds = useMemo(
    () => Array.from(new Set(pics.map((c) => c.breed))),
    []
  );
  const uniqueCities = useMemo(
    () => Array.from(new Set(pics.map((c) => c.city))),
    []
  );

  // منطق الفلترة المتقدمة لبوستات التبني
  const filteredCats = useMemo(() => {
    return pics.filter((cat: CatDetails) => {
      const searchTerm = filters.search.toLowerCase().trim();

      // البحث بالنص (الاسم، الفصيلة، أو الشخصية)
      const matchesSearch =
        searchTerm === "" ||
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.breed.toLowerCase().includes(searchTerm) ||
        cat.personality.toLowerCase().includes(searchTerm);

      // الفلاتر الخارجية
      const matchesBreed =
        filters.breed === "all" || cat.breed === filters.breed;
      const matchesCity =
        filters.city === "all" || cat.city === filters.city;
      const matchesGender =
        filters.gender === "all" || cat.gender === filters.gender;
      const matchesNeutered =
        filters.isNeutered === "all" ||
        String(cat.isNeutered) === filters.isNeutered;
      
      // فلتر التبني
      const matchesAdopted =
        filters.isAdopted === "all" ||
        String(cat.isAdopted) === filters.isAdopted;

      return (
        matchesSearch &&
        matchesBreed &&
        matchesCity &&
        matchesGender &&
        matchesNeutered &&
        matchesAdopted
      );
    });
  }, [filters]);

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

  // الـ Pagination Logic
  const totalPages = Math.ceil(filteredCats.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredCats.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredCats, currentPage]);

  return (
    <section
      className="posts-section pt-64 md:pt-64  pb-12 px-4 min-h-screen"
      id="adoption-posts-section"
    >
      <div className="posts-container max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <h2 className="posts-title Albert_Sans text-4xl md:text-5xl font-extrabold text-white flex items-center gap-2 mb-4">
          <Heart className="w-[1em] h-[1em] text-pink-300 fill-pink-300 animate-bounce" />
          Cats For Adoption
        </h2>

        {/* شريط البحث والفلاتر */}
        <AdoptionFilterBar
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
          <div className="text-center py-16 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white font-medium text-lg shadow-sm">
            🐱 No cats found matching your adoption search criteria.
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
