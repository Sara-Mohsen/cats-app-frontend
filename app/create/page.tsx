"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cat,
  Sparkles,
  AlertCircle,
  HeartHandshake,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import ImageUploader from "../../components/ImageUploader";
import NormalCatForm, { NormalCatData } from "../../components/NormalCatForm";
import AdoptionCatForm, { AdoptionCatData } from "../../components/AdoptionCatForm";
import RescueCatForm, { RescueData } from "../../components/RescueCatForm";
import { useAuth } from "@/app/context/AuthContext";
import { createPostApi, getCitiesApi, getBreedsApi } from "@/lib/api/posts";

type TabType = "normal" | "rescue" | "adoption";

export type CityOption = {
  id: number;
  name: string;
};

export type BreedOption = {
  id: number;
  name: string;
};

export default function CreatePostPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [cities, setCities] = useState<CityOption[]>([]);
  const [breeds, setBreeds] = useState<BreedOption[]>([]);

  useEffect(() => {
    const activeToken = token || localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!isAuthenticated && !activeToken) {
      alert("Please log in to create a post! 🐾");
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        if (typeof getCitiesApi === "function" && typeof getBreedsApi === "function") {
          const [citiesData, breedsData] = await Promise.all([
            getCitiesApi(),
            getBreedsApi(),
          ]);
          setCities(Array.isArray(citiesData) ? citiesData : citiesData.data || []);
          setBreeds(Array.isArray(breedsData) ? breedsData : breedsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchOptions();
  }, []);

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

  const [rescueData, setRescueData] = useState<RescueData>({
    hasInjury: false,
    injuryDescription: "",
    city: "",
    phoneNumber: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
    alert("Please select an image first!");
    return;
  }

    const authToken = token || localStorage.getItem("auth_token") || localStorage.getItem("token");

    if (!authToken) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const currentAge = activeTab === "normal" ? normalCatData.age : adoptionCatData.age;
    if (activeTab === "normal" || activeTab === "adoption") {
      const numAge = Number(currentAge);
      if (numAge > 30 || numAge < 0 || isNaN(numAge)) {
        setAgeError("Age must be between 0 and 30 years");
        return;
      }
    }
 
    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append("post_type", activeTab.toUpperCase());
      formData.append("image", selectedFile);

      
      if (activeTab === "normal") {
        if (normalCatData.name) formData.append("name", normalCatData.name);
        if (normalCatData.age) formData.append("age_years", String(normalCatData.age));
        if (normalCatData.breed) formData.append("breed_id", String(normalCatData.breed));
        if (normalCatData.gender) formData.append("gender", normalCatData.gender.toUpperCase());
        if (normalCatData.city) formData.append("city_id", String(normalCatData.city));
        if (normalCatData.personality) formData.append("personality_description", normalCatData.personality);
        formData.append("is_neutered", normalCatData.isNeutered ? "1" : "0");
        formData.append("is_vaccinated", normalCatData.isVaccinated ? "1" : "0");
      } else if (activeTab === "adoption") {
        if (adoptionCatData.name) formData.append("name", adoptionCatData.name);
        if (adoptionCatData.age) formData.append("age_years", String(adoptionCatData.age));
        if (adoptionCatData.breed) formData.append("breed_id", String(adoptionCatData.breed));
        if (adoptionCatData.gender) formData.append("gender", adoptionCatData.gender.toUpperCase());
        if (adoptionCatData.city) formData.append("city_id", String(adoptionCatData.city));
        if (adoptionCatData.phoneNumber) formData.append("contact_number", adoptionCatData.phoneNumber);
        if (adoptionCatData.personality) formData.append("personality_description", adoptionCatData.personality);
        formData.append("is_neutered", adoptionCatData.isNeutered ? "1" : "0");
        formData.append("is_vaccinated", adoptionCatData.isVaccinated ? "1" : "0");
      } else if (activeTab === "rescue") {
        if (rescueData.city) formData.append("city_id", String(rescueData.city));
        if (rescueData.phoneNumber) formData.append("contact_number", rescueData.phoneNumber);
        formData.append("is_injured", rescueData.hasInjury ? "1" : "0");
        if (rescueData.hasInjury && rescueData.injuryDescription) {
          formData.append("injury_description", rescueData.injuryDescription);
        }
      }

      await createPostApi(formData, authToken);
      alert("Post Created Successfully! 🐾");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all my-6">
        
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

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
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />

            {activeTab === "normal" && (
              <NormalCatForm
                data={normalCatData}
                onChange={setNormalCatData}
                ageError={ageError}
                setAgeError={setAgeError}
                cities={cities}
                breeds={breeds}
              />
            )}

            {activeTab === "adoption" && (
              <AdoptionCatForm
                data={adoptionCatData}
                onChange={setAdoptionCatData}
                ageError={ageError}
                setAgeError={setAgeError}
                cities={cities}
                breeds={breeds}
              />
            )}

            {activeTab === "rescue" && (
              <RescueCatForm
                data={rescueData}
                onChange={setRescueData}
                cities={cities}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              <span>Create Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}