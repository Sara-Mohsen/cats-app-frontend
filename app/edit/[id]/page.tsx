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
  Loader2,
} from "lucide-react";

import ImageUploader from "../../../components/ImageUploader";
import NormalCatForm, { NormalCatData, CityOption, BreedOption } from "../../../components/NormalCatForm";
import AdoptionCatForm, { AdoptionCatData } from "../../../components/AdoptionCatForm";
import RescueCatForm, { RescueData } from "../../../components/RescueCatForm";

import { useAuth } from "@/app/context/AuthContext";
import { getPostById, updatePostApi, getFullImageUrl, getCitiesApi, getBreedsApi } from "@/lib/api/posts";

type TabType = "normal" | "rescue" | "adoption";

export default function EditPostPage() {
  const params = useParams();
  const searchParams = useSearchParams(); 
  const router = useRouter();
  const { token } = useAuth();

  const postId = params?.id as string;
  const postTypeParam = searchParams.get("type");

  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ageError, setAgeError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [cities, setCities] = useState<CityOption[]>([]);
  const [breeds, setBreeds] = useState<BreedOption[]>([]);

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
    rescueId: "",
    hasInjury: false,
    injuryDescription: "",
    city: "",
    phoneNumber: "",
  });

  useEffect(() => {
    async function loadInitialData() {
      if (!postId) return;
      try {
        setIsLoading(true);

        const [post, fetchedCities, fetchedBreeds] = await Promise.all([
          getPostById(postId, token ?? undefined),
          getCitiesApi ? getCitiesApi() : Promise.resolve([]),
          getBreedsApi ? getBreedsApi() : Promise.resolve([]),
        ]);

        if (fetchedCities) setCities(fetchedCities);
        if (fetchedBreeds) setBreeds(fetchedBreeds);

        if (!post) {
          alert("Post not found!");
          router.back();
          return;
        }

        const type = (post.type || postTypeParam || "NORMAL").toLowerCase() as TabType;
        setActiveTab(type);

        if (post.image) {
          console.log("OLD IMAGE FROM API:", post.image);
          setImagePreview(post.image);
        }

        const cityValue = String(post.city_id || post.city?.id || "");
        const breedValue = String(post.breed_id || post.breed?.id || "");

        if (type === "rescue") {
          setRescueData({
            rescueId: post.case_number || `Rescue #${post.id}`,
            hasInjury: post.is_injured ?? false,
            injuryDescription: post.injury_description || "",
            city: cityValue,
            phoneNumber: post.contact_number || "",
          });
        } else if (type === "adoption") {
          setAdoptionCatData({
            name: post.name || "",
            age: post.age !== null && post.age !== undefined ? String(post.age) : "",
            breed: breedValue,
            personality: post.personality || "",
            gender: post.gender === "FEMALE" ? "Female" : "Male",
            isNeutered: post.is_neutered ?? false,
            isVaccinated: post.is_vaccinated ?? false,
            city: cityValue,
            phoneNumber: post.contact_number || "",
          });
        } else {
          setNormalCatData({
            name: post.name || "",
            age: post.age !== null && post.age !== undefined ? String(post.age) : "",
            breed: breedValue,
            personality: post.personality || "",
            gender: post.gender === "FEMALE" ? "Female" : "Male",
            isNeutered: post.is_neutered ?? false,
            isVaccinated: post.is_vaccinated ?? false,
            city: cityValue,
          });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("Failed to load post data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [postId, token, postTypeParam, router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in first!");
      return;
    }

    const currentCatAge =
      activeTab === "normal" ? normalCatData.age : adoptionCatData.age;

    if (activeTab === "normal" || activeTab === "adoption") {
      const numAge = Number(currentCatAge);
      if (numAge > 30 || numAge < 0 || isNaN(numAge)) {
        setAgeError("Age must be between 0 and 30 years");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("type", activeTab.toUpperCase());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // 3️⃣ إرسال IDs الخاص بالمدينة والفصيلة للباك إيند
      if (activeTab === "normal") {
        formData.append("name", normalCatData.name);
        formData.append("age", normalCatData.age);
        if (normalCatData.breed) formData.append("breed_id", normalCatData.breed);
        formData.append("personality", normalCatData.personality);
        formData.append("gender", normalCatData.gender.toUpperCase());
        formData.append("is_neutered", normalCatData.isNeutered ? "1" : "0");
        formData.append("is_vaccinated", normalCatData.isVaccinated ? "1" : "0");
        formData.append("city_id", normalCatData.city);
      } else if (activeTab === "adoption") {
        formData.append("name", adoptionCatData.name);
        formData.append("age", adoptionCatData.age);
        if (adoptionCatData.breed) formData.append("breed_id", adoptionCatData.breed);
        formData.append("personality", adoptionCatData.personality);
        formData.append("gender", adoptionCatData.gender.toUpperCase());
        formData.append("is_neutered", adoptionCatData.isNeutered ? "1" : "0");
        formData.append("is_vaccinated", adoptionCatData.isVaccinated ? "1" : "0");
        formData.append("city_id", adoptionCatData.city);
        formData.append("contact_number", adoptionCatData.phoneNumber);
      } else if (activeTab === "rescue") {
        formData.append("is_injured", rescueData.hasInjury ? "1" : "0");
        formData.append("injury_description", rescueData.injuryDescription);
        formData.append("city_id", rescueData.city);
        formData.append("contact_number", rescueData.phoneNumber);
      }

      await updatePostApi(postId, formData, token);

      alert("Post Updated Successfully! 🐾");
      router.back();
    } catch (error) {
      console.error("Failed to update post:", error);
      alert(error instanceof Error ? error.message : "Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 font-semibold gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading post details... 🐾</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all my-6">
        
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

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
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />

            {/* 4️⃣ تمرير القوائم الحقيقية إلى المكونات بدلاً من مصفوفات فارغة */}
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
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 px-4 bg-linear-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}