import React from "react";
import { MapPin, Activity } from "lucide-react";

type RescueInfoProps = {
  rescueId: string;
  city: string;
  isInjured?: boolean;
};

export default function RescueInfo({
  rescueId,
  city,
  isInjured = false,
}: RescueInfoProps) {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-extrabold text-pink-950 transition-colors duration-300 group-hover:text-pink-600">
          {rescueId}
        </h3>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* badge المدينة */}
          <span className="flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100">
            <MapPin size={12} className="text-pink-400" />
            {city}
          </span>

          {/* badge حالة الصحة */}
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl border ${
              isInjured
                ? "text-purple-600 bg-purple-50 border-purple-100"
                : "text-gray-600 bg-gray-100 border-gray-200"
            }`}
          >
            <Activity size={12} />
            {isInjured ? "Injured" : "Healthy"}
          </span>
        </div>
      </div>
    </div>
  );
}
