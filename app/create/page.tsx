"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Cat,
  Sparkles,
  Check,
  X,
  Phone,
  AlertCircle,
  HeartHandshake,
  ArrowLeft,
} from "lucide-react";

// Types
type TabType = "normal" | "rescue" | "adoption";

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

export default function CreatePostPage() {
  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Validation state for age
  const [ageError, setAgeError] = useState<string>("");

  // Normal & Adoption Form State
  const [catData, setCatData] = useState({
    name: "",
    age: "",
    breed: "", // بداية فارغة ليتم اختيارها
    personality: "",
    gender: "Male" as "Male" | "Female",
    isNeutered: false,
    isVaccinated: false,
    city: "", // بداية فارغة ليتم اختيارها
    phoneNumber: "", // للتبني فقط
  });

  // Rescue Form State
  const [rescueData, setRescueData] = useState({
    // eslint-disable-next-line react-hooks/purity
    rescueId: `Rescue #${Math.floor(100 + Math.random() * 900)}`, // ID تلقائي
    hasInjury: false,
    injuryDescription: "",
    city: "", // بداية فارغة ليتم اختيارها
    phoneNumber: "",
  });

  // Handle Age Input Change with Error Handling
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCatData({ ...catData, age: val });

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

  // Handle Image Upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const resetImage = () => setImagePreview(null);

  // Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check age logic before submitting
    if (activeTab === "normal" || activeTab === "adoption") {
      const numAge = Number(catData.age);
      if (numAge > 30 || numAge < 0 || isNaN(numAge)) {
        setAgeError("Age must be between 0 and 30 years");
        return;
      }
    }

    if (activeTab === "rescue") {
      console.log("Rescue Post Submitted:", { ...rescueData, imagePreview });
    } else {
      console.log(`${activeTab.toUpperCase()} Post Submitted:`, {
        ...catData,
        imagePreview,
      });
    }
    alert("Post Created Successfully! 🐾");
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all my-6">
        
        {/* Top Gradient Bar */}
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

        {/* Back Button */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1 text-pink-500 font-bold text-sm bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
            <Sparkles size={16} />
            <span>Create Post</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          
          {/* 1. Tabs Navigation */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-pink-50/80 rounded-2xl border border-pink-100 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("normal");
                resetImage();
              }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "normal"
                  ? "bg-white text-pink-600 shadow-sm border border-pink-100"
                  : "text-gray-500 hover:text-pink-600"
              }`}
            >
              <Cat size={16} />
              <span>Normal Post</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("rescue");
                resetImage();
              }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "rescue"
                  ? "bg-white text-pink-600 shadow-sm border border-pink-100"
                  : "text-gray-500 hover:text-pink-600"
              }`}
            >
              <AlertCircle size={16} />
              <span>Rescue</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("adoption");
                resetImage();
              }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "adoption"
                  ? "bg-white text-pink-600 shadow-sm border border-pink-100"
                  : "text-gray-500 hover:text-pink-600"
              }`}
            >
              <HeartHandshake size={16} />
              <span>Adoption</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 2. Image Upload */}
            <div>
              <label className="block text-xs font-bold text-pink-900 uppercase tracking-wider mb-2">
                Cat Photo *
              </label>
              <div className="relative border-2 border-dashed border-pink-300 hover:border-pink-500 rounded-2xl bg-white/60 p-4 transition text-center cursor-pointer flex flex-col items-center justify-center min-h-40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required={!imagePreview}
                />
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-pink-400">
                    <Upload size={32} className="mb-2" />
                    <span className="text-sm font-semibold">Click to upload photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* ----------------- FORM 1: NORMAL & FORM 3: ADOPTION ----------------- */}
            {(activeTab === "normal" || activeTab === "adoption") && (
              <>
                {/* Name & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
                      Cat Name *
                    </label>
                    <input
                      type="text"
                      value={catData.name}
                      onChange={(e) => setCatData({ ...catData, name: e.target.value })}
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
                      value={catData.age}
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
                      value={catData.breed}
                      onChange={(e) => setCatData({ ...catData, breed: e.target.value })}
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
                      value={catData.city}
                      onChange={(e) => setCatData({ ...catData, city: e.target.value })}
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
                    value={catData.personality}
                    onChange={(e) => setCatData({ ...catData, personality: e.target.value })}
                    placeholder="Friendly, quiet..."
                    className="w-full p-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                  />
                </div>

                {/* Gender, Neutered, Vaccinated Toggles */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-900 uppercase">Gender:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCatData({ ...catData, gender: "Male" })}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                          catData.gender === "Male"
                            ? "bg-pink-500 text-white"
                            : "bg-white text-gray-600 border border-pink-200"
                        }`}
                      >
                        ♂ Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatData({ ...catData, gender: "Female" })}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                          catData.gender === "Female"
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
                        onClick={() => setCatData({ ...catData, isNeutered: true })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          catData.isNeutered ? "bg-pink-500 text-white" : "bg-white text-gray-500 border border-pink-200"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatData({ ...catData, isNeutered: false })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          !catData.isNeutered ? "bg-gray-400 text-white" : "bg-white text-gray-500 border border-pink-200"
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
                        onClick={() => setCatData({ ...catData, isVaccinated: true })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          catData.isVaccinated ? "bg-pink-500 text-white" : "bg-white text-gray-500 border border-pink-200"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatData({ ...catData, isVaccinated: false })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          !catData.isVaccinated ? "bg-gray-400 text-white" : "bg-white text-gray-500 border border-pink-200"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Number (للتبني فقط) */}
                {activeTab === "adoption" && (
                  <div>
                    <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
                      Owner Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-3 text-pink-400" />
                      <input
                        type="tel"
                        value={catData.phoneNumber}
                        onChange={(e) => setCatData({ ...catData, phoneNumber: e.target.value })}
                        placeholder="05XXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ----------------- FORM 2: RESCUE ----------------- */}
            {activeTab === "rescue" && (
              <>
                {/* Auto Generated ID Badge */}
                <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-100">
                  <span className="text-xs font-bold text-purple-900 uppercase">Rescue Case ID:</span>
                  <span className="text-xs font-extrabold text-purple-700 bg-white px-3 py-1 rounded-xl border border-purple-200">
                    {rescueData.rescueId}
                  </span>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
                    City *
                  </label>
                  <select
                    value={rescueData.city}
                    onChange={(e) => setRescueData({ ...rescueData, city: e.target.value })}
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

                {/* Injury Check */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-900 uppercase">Is Injured?:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRescueData({ ...rescueData, hasInjury: true })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ${
                          rescueData.hasInjury ? "bg-pink-500 text-white" : "bg-white text-gray-500 border border-pink-200"
                        }`}
                      >
                        <Check size={14} /> Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setRescueData({ ...rescueData, hasInjury: false })}
                        className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ${
                          !rescueData.hasInjury ? "bg-gray-400 text-white" : "bg-white text-gray-500 border border-pink-200"
                        }`}
                      >
                        <X size={14} /> No
                      </button>
                    </div>
                  </div>

                  {/* Description field if Injured = True */}
                  {rescueData.hasInjury && (
                    <div className="pt-2 border-t border-pink-100">
                      <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
                        Injury Description *
                      </label>
                      <textarea
                        rows={2}
                        value={rescueData.injuryDescription}
                        onChange={(e) =>
                          setRescueData({ ...rescueData, injuryDescription: e.target.value })
                        }
                        placeholder="Describe the injury..."
                        className="w-full p-3 bg-white border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* User Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
                    User Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-3 text-pink-400" />
                    <input
                      type="tel"
                      value={rescueData.phoneNumber}
                      onChange={(e) => setRescueData({ ...rescueData, phoneNumber: e.target.value })}
                      placeholder="05XXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Create Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-4 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Create Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
