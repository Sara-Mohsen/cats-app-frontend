"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  Cat,
  Sparkles,
  AlertCircle,
  HeartHandshake,
  ArrowLeft,
} from "lucide-react";

import ImageUploader from "../../components/ImageUploader";
import NormalCatForm, { NormalCatData } from "../../components/NormalCatForm";
import AdoptionCatForm, { AdoptionCatData } from "../../components/AdoptionCatForm";
import RescueCatForm, { RescueData } from "../../components/RescueCatForm";

type TabType = "normal" | "rescue" | "adoption";

export default function CreatePostPage() {
  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string>("");

  // 1. State للقطط العادية (بدون رقم هاتف)
  const [normalCatData, setNormalCatData] = useState<NormalCatData>({
    name: "",
    age: "",
    breed: "",
    personality: "",
    gender: "Male",
    isNeutered: false,
    isVaccinated: false,
    city: "",
  });

  // 2. State لقطط التبني (مع رقم الهاتف)
  const [adoptionCatData, setAdoptionCatData] = useState<AdoptionCatData>({
    name: "",
    age: "",
    breed: "",
    personality: "",
    gender: "Male",
    isNeutered: false,
    isVaccinated: false,
    city: "",
    phoneNumber: "",
  });

  // 3. State لحالات الإنقاذ
  const [rescueData, setRescueData] = useState<RescueData>({
    // eslint-disable-next-line react-hooks/purity
    rescueId: `Rescue #${Math.floor(100 + Math.random() * 900)}`,
    hasInjury: false,
    injuryDescription: "",
    city: "",
    phoneNumber: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetImage = () => setImagePreview(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // تحديد العمر للفحص بناءً على نوع البوست
    const currentAge =
      activeTab === "normal" ? normalCatData.age : adoptionCatData.age;

    if (activeTab === "normal" || activeTab === "adoption") {
      const numAge = Number(currentAge);
      if (numAge > 30 || numAge < 0 || isNaN(numAge)) {
        setAgeError("Age must be between 0 and 30 years");
        return;
      }
    }

    // طباعة البيانات وحفظ البوست حسب الـ Tab
    if (activeTab === "rescue") {
      console.log("Rescue Post Submitted:", { ...rescueData, imagePreview });
    } else if (activeTab === "adoption") {
      console.log("Adoption Post Submitted:", {
        ...adoptionCatData,
        imagePreview,
      });
    } else {
      console.log("Normal Post Submitted:", {
        ...normalCatData,
        imagePreview,
      });
    }

    alert("Post Created Successfully! 🐾");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all my-6">
        
        {/* Top Bar */}
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
          {/* Tabs Nav */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-pink-50/80 rounded-2xl border border-pink-100 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("normal");
                resetImage();
              }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
            {/* 1. Image Uploader */}
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />

            {/* 2. Form Content conditional rendering */}
            {activeTab === "normal" && (
              <NormalCatForm
                data={normalCatData}
                onChange={setNormalCatData}
                ageError={ageError}
                setAgeError={setAgeError}
              />
            )}

            {activeTab === "adoption" && (
              <AdoptionCatForm
                data={adoptionCatData}
                onChange={setAdoptionCatData}
                ageError={ageError}
                setAgeError={setAgeError}
              />
            )}

            {activeTab === "rescue" && (
              <RescueCatForm data={rescueData} onChange={setRescueData} />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-4 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
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
