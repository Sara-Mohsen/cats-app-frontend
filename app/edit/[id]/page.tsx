"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Cat,
  Sparkles,
  AlertCircle,
  HeartHandshake,
  ArrowLeft,
  Pencil,
} from "lucide-react";

import ImageUploader from "../../../components/ImageUploader";
import NormalCatForm, { NormalCatData } from "../../../components/NormalCatForm";
import AdoptionCatForm, { AdoptionCatData } from "../../../components/AdoptionCatForm";
import RescueCatForm, { RescueData } from "../../../components/RescueCatForm";

// 1. بيانات القطط العادية (بدون رقم هاتف)
import { getCatById as getNormalCatById } from "../../../lib/data";

// 2. بيانات التبني (تحتوي على رقم هاتف)
import { getCatById as getAdoptionCatById } from "../../../lib/datad";

// 3. بيانات الإنقاذ
import { getRescueById } from "../../../lib/datar";

type TabType = "normal" | "rescue" | "adoption";

export default function EditPostPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // 👈 جلب معاملات الـ URL (النوع)
  const router = useRouter();

  const postId = params?.id;
  const postType = searchParams.get("type"); // القيمة: "normal" | "adoption" | "rescue"

  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. State للقطط العادية (بدون phoneNumber)
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

  // 2. State لقطط التبني (يحتوي على phoneNumber)
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

  // 3. State للإنقاذ
  const [rescueData, setRescueData] = useState<RescueData>({
    rescueId: "",
    hasInjury: false,
    injuryDescription: "",
    city: "",
    phoneNumber: "",
  });

  // useEffect للبحث المباشر والدقيق حسب الـ postType لتفادي تعارض الـ IDs
  useEffect(() => {
    if (!postId) return;

    const idString = String(postId);

    // 🔴 1. إذا كان البوست من نوع إنقاذ (Rescue)
    if (postType === "rescue") {
      const rescueItem = getRescueById(idString);
      if (rescueItem) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTab("rescue");
        setImagePreview(rescueItem.image || null);
        setRescueData({
          rescueId: rescueItem.formattedId || `Rescue #${rescueItem.id}`,
          hasInjury: rescueItem.isInjured,
          injuryDescription: rescueItem.injuryDescription || "",
          city: rescueItem.city || "",
          phoneNumber: rescueItem.phone || "",
        });
        setIsLoading(false);
        return;
      }
    }

    // 🔴 2. إذا كان البوست من نوع تبني (Adoption)
    if (postType === "adoption") {
      const adoptionItem = getAdoptionCatById(idString);
      if (adoptionItem) {
        setActiveTab("adoption");
        setImagePreview(adoptionItem.image || null);
        setAdoptionCatData({
          name: adoptionItem.name || "",
          age: String(adoptionItem.age || ""),
          breed: adoptionItem.breed || "",
          personality: adoptionItem.personality || "",
          gender: adoptionItem.gender || "Male",
          isNeutered: adoptionItem.isNeutered || false,
          isVaccinated: adoptionItem.isVaccinated || false,
          city: adoptionItem.city || "",
          phoneNumber: adoptionItem.phone || "", // 👈 استخدام .phone المطابق لملف datad.ts
        });
        setIsLoading(false);
        return;
      }
    }

    // 🔴 3. إذا كان البوست عادي (Normal)
    if (postType === "normal") {
      const normalItem = getNormalCatById(idString);
      if (normalItem) {
        setActiveTab("normal");
        setImagePreview(normalItem.image || null);
        setNormalCatData({
          name: normalItem.name || "",
          age: String(normalItem.age || ""),
          breed: normalItem.breed || "",
          personality: normalItem.personality || "",
          gender: normalItem.gender || "Male",
          isNeutered: normalItem.isNeutered || false,
          isVaccinated: normalItem.isVaccinated || false,
          city: normalItem.city || "",
        });
        setIsLoading(false);
        return;
      }
    }

    // 🟡 4. Fallback في حال فتح الصفحة مباشرة دون تمرير type بالـ URL
    const rescueItem = getRescueById(idString);
    if (rescueItem) {
      setActiveTab("rescue");
      setImagePreview(rescueItem.image || null);
      setRescueData({
        rescueId: rescueItem.formattedId || `Rescue #${rescueItem.id}`,
        hasInjury: rescueItem.isInjured,
        injuryDescription: rescueItem.injuryDescription || "",
        city: rescueItem.city || "",
        phoneNumber: rescueItem.phone || "",
      });
      setIsLoading(false);
      return;
    }

    const adoptionItem = getAdoptionCatById(idString);
    if (adoptionItem) {
      setActiveTab("adoption");
      setImagePreview(adoptionItem.image || null);
      setAdoptionCatData({
        name: adoptionItem.name || "",
        age: String(adoptionItem.age || ""),
        breed: adoptionItem.breed || "",
        personality: adoptionItem.personality || "",
        gender: adoptionItem.gender || "Male",
        isNeutered: adoptionItem.isNeutered || false,
        isVaccinated: adoptionItem.isVaccinated || false,
        city: adoptionItem.city || "",
        phoneNumber: adoptionItem.phone || "",
      });
      setIsLoading(false);
      return;
    }

    const normalItem = getNormalCatById(idString);
    if (normalItem) {
      setActiveTab("normal");
      setImagePreview(normalItem.image || null);
      setNormalCatData({
        name: normalItem.name || "",
        age: String(normalItem.age || ""),
        breed: normalItem.breed || "",
        personality: normalItem.personality || "",
        gender: normalItem.gender || "Male",
        isNeutered: normalItem.isNeutered || false,
        isVaccinated: normalItem.isVaccinated || false,
        city: normalItem.city || "",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [postId, postType]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // التحقق من العمر للقطط العادية والتبني
    const currentCatAge =
      activeTab === "normal" ? normalCatData.age : adoptionCatData.age;

    if (activeTab === "normal" || activeTab === "adoption") {
      const numAge = Number(currentCatAge);
      if (numAge > 30 || numAge < 0 || isNaN(numAge)) {
        setAgeError("Age must be between 0 and 30 years");
        return;
      }
    }

    // طباعة البيانات وحفظ التعديل حسب نوع الـ Tab
    if (activeTab === "rescue") {
      console.log("Updated Rescue Post:", { id: postId, ...rescueData, imagePreview });
    } else if (activeTab === "adoption") {
      console.log("Updated Adoption Post:", {
        id: postId,
        ...adoptionCatData,
        imagePreview,
      });
    } else {
      console.log("Updated Normal Cat Post:", {
        id: postId,
        ...normalCatData,
        imagePreview,
      });
    }

    alert("Post Updated Successfully! 🐾");
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold">
        Loading post details... 🐾
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all my-6">
        
        {/* Top Bar */}
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

        {/* Back Button & Header Badge */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Cancel & Back</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-pink-600 font-bold text-sm bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
            <Pencil size={16} />
            <span>Edit Post</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Tabs Nav */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-pink-50/80 rounded-2xl border border-pink-100 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("normal")}
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
              onClick={() => setActiveTab("rescue")}
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
              onClick={() => setActiveTab("adoption")}
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

            {/* 2. Form Content إسناد المكون المفصول والمناسب لكل نوع */}
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

            {/* Submit / Update Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-4 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
