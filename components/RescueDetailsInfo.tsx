import React from "react";
import { MapPin, Phone, ShieldAlert, AlertTriangle, HeartHandshake } from "lucide-react";

export type RescueDataType = {
  formattedId: string;
  city: string;
  isInjured?: boolean;
  injuryDescription?: string;
  phone: string;
};

type RescueDetailsInfoProps = {
  rescueData: RescueDataType;
  isRescued?: boolean; // 👈 إضافة حالة الإنقاذ للتحكم بالزر
  onRescueAction: () => void;
};

export default function RescueDetailsInfo({
  rescueData,
  isRescued = false, // 👈 القيمة الافتراضية
  onRescueAction,
}: RescueDetailsInfoProps) {
  return (
    <div className="space-y-6">
      {/* المعرف والمدينة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-950 flex items-center gap-2">
            {rescueData.formattedId}
          </h1>
          <div className="flex items-center gap-2 text-pink-600 font-medium text-sm mt-1">
            <MapPin size={16} className="text-pink-400" />
            <span>{rescueData.city}</span>
          </div>
        </div>
      </div>

      {/* التفاصيل الإضافية */}
      <div className="space-y-4">
        {/* حالة الإصابة */}
        <div className="bg-white/70 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                rescueData.isInjured
                  ? "text-purple-600 bg-purple-100 border-purple-100"
                  : "text-gray-600 bg-gray-100 border-gray-200"
              }`}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Condition
              </p>
              <p className="text-sm font-bold text-gray-800">
                {rescueData.isInjured
                  ? "Injured / Needs Care"
                  : "Healthy / Safe"}
              </p>
            </div>
          </div>
        </div>

        {/* وصف الإصابة */}
        {rescueData.isInjured && rescueData.injuryDescription && (
          <div className="bg-purple-100/70 border border-purple-100 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2 mb-1.5">
              <AlertTriangle size={16} className="text-purple-500" />
              <span>Injury Description</span>
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {rescueData.injuryDescription}
            </p>
          </div>
        )}

        {/* رقم التواصل */}
        <div className="bg-white/70 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                Contact Number
              </p>
              <p className="text-sm font-bold text-gray-800">
                {rescueData.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 👈 زر الانقاذ الديناميكي (يتغير للون الرمادي عند الانقاذ بنفس طريقة التبني) */}
      <button
        onClick={onRescueAction}
        disabled={isRescued}
        className={`w-full py-4 px-6 font-bold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 ${
          isRescued
            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white hover:shadow-xl transform active:scale-[0.98] cursor-pointer"
        }`}
      >
        <HeartHandshake size={20} />
        <span>{isRescued ? "Already Rescued" : "Rescue This Cat"}</span>
      </button>
    </div>
  );
}
