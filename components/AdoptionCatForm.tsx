"use client";

import React, { ChangeEvent } from "react";
import { Phone } from "lucide-react";

const BREEDS = [
  "Persian",
  "Siamese",
  "British Shorthair",
  "Scottish Fold",
  "Ragdoll",
  "Orange Tabby",
  "Mixed / Local",
  "Other",
];

const CITIES = [
  "Riyadh",
  "Jeddah",
  "Makkah",
  "Madinah",
  "Dammam",
  "Khobar",
  "Abha",
  "Other",
];

export type AdoptionCatData = {
  name: string;
  age: string;
  breed: string;
  personality: string;
  gender: "Male" | "Female";
  isNeutered: boolean;
  isVaccinated: boolean;
  city: string;
  phoneNumber: string; // محدد وجباري هنا
};

type AdoptionCatFormProps = {
  data: AdoptionCatData;
  onChange: (data: AdoptionCatData) => void;
  ageError: string;
  setAgeError: (err: string) => void;
};

export default function AdoptionCatForm({
  data,
  onChange,
  ageError,
  setAgeError,
}: AdoptionCatFormProps) {
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ ...data, age: val });

    if (val !== "") {
      const numAge = Number(val);
      if (isNaN(numAge)) {
        setAgeError("Please enter a valid number");
      } else if (numAge > 30) {
        setAgeError("Age cannot be greater than 30 years");
      } else if (numAge < 0) {
        setAgeError("Age cannot be negative");
      } else {
        setAgeError("");
      }
    } else {
      setAgeError("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Name & Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
            Cat Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="e.g. Luna"
            className="w-full px-4 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
            Age (Years) *
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={data.age}
            onChange={handleAgeChange}
            placeholder="e.g. 2"
            className={`w-full px-4 py-2.5 bg-white/80 border rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 ${
              ageError
                ? "border-red-400 focus:ring-red-400"
                : "border-pink-200 focus:ring-pink-400"
            }`}
            required
          />
          {ageError && (
            <p className="text-red-500 text-xs mt-1 font-semibold">
              {ageError}
            </p>
          )}
        </div>
      </div>

      {/* Breed & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
            Breed *
          </label>
          <select
            value={data.breed}
            onChange={(e) => onChange({ ...data, breed: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          >
            <option value="" disabled hidden>
              Choose Breed
            </option>
            {BREEDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
            City *
          </label>
          <select
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          >
            <option value="" disabled hidden>
              Choose City
            </option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Personality */}
      <div>
        <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
          Personality
        </label>
        <textarea
          rows={2}
          value={data.personality}
          onChange={(e) => onChange({ ...data, personality: e.target.value })}
          placeholder="Friendly, quiet..."
          className="w-full p-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
        />
      </div>

      {/* Toggles */}
      <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-pink-900 uppercase">Gender:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...data, gender: "Male" })}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                data.gender === "Male"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-600 border border-pink-200"
              }`}
            >
              ♂ Male
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, gender: "Female" })}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                data.gender === "Female"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-600 border border-pink-200"
              }`}
            >
              ♀ Female
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-pink-100">
          <span className="text-xs font-bold text-pink-900 uppercase">Neutered:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...data, isNeutered: true })}
              className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer ${
                data.isNeutered ? "bg-pink-500 text-white" : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, isNeutered: false })}
              className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer ${
                !data.isNeutered ? "bg-gray-400 text-white" : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-pink-100">
          <span className="text-xs font-bold text-pink-900 uppercase">Vaccinated:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...data, isVaccinated: true })}
              className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer ${
                data.isVaccinated ? "bg-pink-500 text-white" : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, isVaccinated: false })}
              className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer ${
                !data.isVaccinated ? "bg-gray-400 text-white" : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Owner Phone Number */}
      <div>
        <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
          Owner Phone Number *
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-3.5 top-3 text-pink-400" />
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
            placeholder="05XXXXXXXX"
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>
      </div>
    </div>
  );
}
