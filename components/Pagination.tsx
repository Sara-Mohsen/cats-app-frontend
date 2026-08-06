import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  

  const handlePageClick = (page: number) => {
    onPageChange(page);
    // Smooth Scroll إلى أول الصفحة عند الانتقال
    const postsSection = document.getElementById("all-posts-section");
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center items-center mt-12 mb-6">
      {/* الكبسولة الزجاجية المماثلة لتصميم Figma */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-white/80 shadow-lg">
        {/* زر السابق */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-full text-gray-400 hover:text-pink-500 hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* الأرقام الدائرية */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? "bg-linear-to-r from-pink-400 to-purple-400 text-white shadow-md scale-105"
                  : "text-gray-600 hover:text-pink-500 hover:bg-white/60"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* زر التالي */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-full text-gray-400 hover:text-pink-500 hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
