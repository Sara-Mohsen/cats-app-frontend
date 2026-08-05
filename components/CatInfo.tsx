import React from "react";
import { PawPrint, Cake, MapPin } from "lucide-react";

type CatInfoProps = {
  name: string;
  city: string;
  breed: string;
  age: string | number;
};

export default function CatInfo({ name, city, breed, age }: CatInfoProps) {
  return (
    <div className="p-5 space-y-3">
      {/* الاسم والمدينة */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-extrabold text-pink-950 transition-colors duration-300 group-hover:text-pink-600">
          {name}
        </h3>

        {/* badge المدينة */}
        <span className="flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100">
          <MapPin size={12} className="text-pink-400" />
          {city}
        </span>
      </div>

      {/* الفصيلة والعمر */}
      <div className="flex items-center gap-4 text-xs font-medium text-gray-600 pt-1 border-t border-pink-50">
        <p className="flex items-center gap-1.5 text-pink-900/80">
          <PawPrint className="w-4 h-4 text-pink-400" />
          <span>{breed}</span>
        </p>

        <p className="flex items-center gap-1.5 text-purple-900/80">
          <Cake className="w-4 h-4 text-purple-400" />
          <span>{typeof age === "number" ? `${age} Years` : age}</span>
        </p>
      </div>
    </div>
  );
}
