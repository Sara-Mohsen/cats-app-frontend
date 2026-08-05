import React from "react";
import {
  PawPrint,
  Cake,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Syringe,
  Cat,
  Phone,
} from "lucide-react";

export type CatDetailsType = {
  name: string;
  breed: string;
  age: string | number;
  city: string;
  gender: string;
  isNeutered: boolean;
  isVaccinated: boolean;
  personality: string;
  phone?: string; // 👈 اختياري لبورسات التبني
};

export default function CatDetailsInfo({ cat }: { cat: CatDetailsType }) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-950 flex items-center gap-2">
            {cat.name}
          </h1>
          <div className="flex items-center gap-2 text-pink-600 font-medium text-sm mt-1">
            <MapPin size={16} className="text-pink-400" />
            <span>{cat.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-pink-800 text-xs font-semibold px-3 py-1.5 rounded-xl">
            <PawPrint size={14} className="text-pink-500" />
            {cat.breed}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-xl">
            <Cake size={14} className="text-purple-500" />
            {cat.age}
          </span>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <PawPrint size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Breed</p>
            <p className="text-sm font-bold text-gray-800">{cat.breed}</p>
          </div>
        </div>

        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <Cake size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Age</p>
            <p className="text-sm font-bold text-gray-800">{cat.age}</p>
          </div>
        </div>

        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">City</p>
            <p className="text-sm font-bold text-gray-800">{cat.city}</p>
          </div>
        </div>

        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <Cat size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Gender</p>
            <p className="text-sm font-bold text-gray-800">{cat.gender}</p>
          </div>
        </div>

        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Neutered</p>
            <p className="text-sm font-bold text-gray-800">
              {cat.isNeutered ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
            <Syringe size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Vaccinated</p>
            <p className="text-sm font-bold text-gray-800">
              {cat.isVaccinated ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* 👈 ظهور رقم الهاتف إذا كان موجوداً */}
        {cat.phone && (
          <div className="bg-white/70 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3 col-span-2 sm:col-span-3">
            <div className="p-2.5 bg-pink-100/60 rounded-xl text-pink-600">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                Owner Contact
              </p>
              <p className="text-sm font-bold text-gray-800">{cat.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Personality */}
      <div className="bg-pink-50/60 border border-pink-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-2 mb-2">
          <HeartHandshake size={18} className="text-pink-500" />
          <span>Personality & Description</span>
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          {cat.personality}
        </p>
      </div>
    </div>
  );
}
