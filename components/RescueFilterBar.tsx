"use client";
import React, { useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react";

export interface RescueFilterState {
  search: string;
  city: string;
  isInjured: string; // 'all' | 'true' | 'false'
  isRescued: string; // 'all' | 'true' | 'false'
}

interface RescueFilterBarProps {
  filters: RescueFilterState;
  setFilters: React.Dispatch<React.SetStateAction<RescueFilterState>>;
  cities: string[];
  onReset: () => void;
}

export default function RescueFilterBar({
  filters,
  setFilters,
  cities,
  onReset,
}: RescueFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field: keyof RescueFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl p-4 md:p-6 shadow-lg mt-6 mb-10 transition-all">
      {/* الصف العلوي: البحث + زر إظهار/إخفاء الفلاتر */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID (e.g. Rescue #01) or injury description..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 focus:bg-white text-gray-800 rounded-2xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400 shadow-inner text-sm md:text-base transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/50 text-sm font-semibold transition-all shadow-sm cursor-pointer ${
            showFilters
              ? "bg-pink-400/80 text-white shadow-inner"
              : "bg-white/60 hover:bg-white text-slate-600"
          }`}
          title="Toggle Filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              showFilters ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* قسم الفلاتر المنبثقة */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/30 transition-all duration-300">
          {/* فلتر المدينة */}
          <select
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="bg-white/70 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-2xl border border-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer shadow-sm"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* فلتر حالة الإصابة */}
          <select
            value={filters.isInjured}
            onChange={(e) => handleChange("isInjured", e.target.value)}
            className="bg-white/70 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-2xl border border-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer shadow-sm"
          >
            <option value="all">Health Condition (All)</option>
            <option value="true">Injured 🩹</option>
            <option value="false">Healthy / Healthy Status 🐾</option>
          </select>

          {/* فلتر حالة الإنقاذ */}
          <select
            value={filters.isRescued}
            onChange={(e) => handleChange("isRescued", e.target.value)}
            className="bg-white/70 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-2xl border border-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer shadow-sm"
          >
            <option value="all">Rescue Status (All)</option>
            <option value="false">Needs Rescue 🚨</option>
            <option value="true">Rescued ✅</option>
          </select>

          {/* زر إعادة الضبط */}
          <button
            onClick={onReset}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-pink-500/40 hover:bg-pink-400 text-white font-medium text-sm py-2.5 px-4 rounded-2xl transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
