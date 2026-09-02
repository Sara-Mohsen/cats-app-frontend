"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  User, Pencil, Camera, Lock, Check, X, Phone, MapPin, AtSign, Key, LogOut, Loader2, Mail 
} from "lucide-react";
import "../styles/dashboard.css";
import "../styles/dash-nav.css";
import DashNav from "../../components/DashNav";
import { getProfileApi, updateProfileApi, getCitiesApi, getFullImageUrl } from "@/lib/api/posts"; 
import { useAuth } from "../context/AuthContext";

interface City {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { token: authContextToken, user: authUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    cityId: "",
    cityName: "",
    password: "••••••••",
    avatar: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initData() {
      const token = authContextToken || localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const [user, citiesData] = await Promise.all([
          getProfileApi(token),
          getCitiesApi().catch(() => [])
        ]);

        setCities(citiesData);

        const userCityId = user.city_id || user.city?.id || "";
        const matchedCity = citiesData.find((c: City) => String(c.id) === String(userCityId));
        const userCityName = user.city?.name || matchedCity?.name || (typeof user.city === "string" ? user.city : "");

        setProfile({
          name: user.full_name || user.fullName || user.name || authUser?.fullName || "",
          username: user.username || authUser?.username || "",
          email: user.email || authUser?.email || "",
          phone: user.phone || "",
          cityId: String(userCityId),
          cityName: userCityName,
          password: "••••••••",
          avatar: user.avatar_url ? getFullImageUrl(user.avatar_url) : "",
        });
      } catch (err: unknown) {
        console.error("Profile Fetch Error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (errorMessage.includes("401") || errorMessage.includes("Unauthenticated")) {
          localStorage.removeItem("token");
          if (logout) logout();
          router.push("/login");
        } else {
          setError("Failed to load account data from the server.");
        }
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [authContextToken, authUser, router, logout]);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = async (field: string) => {
    const token = authContextToken || localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      
      if (field === "name") formData.append("full_name", tempValue);
      if (field === "email") formData.append("email", tempValue);
      if (field === "phone") formData.append("phone", tempValue);
      if (field === "city") formData.append("city_id", tempValue);

      const updatedUser = await updateProfileApi(formData, token);

      const selectedCity = cities.find(c => String(c.id) === tempValue);

      setProfile((prev) => ({
        ...prev,
        name: updatedUser.full_name || updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        phone: updatedUser.phone || prev.phone,
        cityId: updatedUser.city_id ? String(updatedUser.city_id) : tempValue,
        cityName: updatedUser.city?.name || selectedCity?.name || prev.cityName,
      }));

      setEditingField(null);
      showSuccessToast();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = authContextToken || localStorage.getItem("token");
    if (!file || !token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const updatedUser = await updateProfileApi(formData, token);

      setProfile((prev) => ({
        ...prev,
        avatar: getFullImageUrl(updatedUser.avatar_url),
      }));

      showSuccessToast();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
  const token = authContextToken || localStorage.getItem("token");
  setLoggingOut(true);

  try {
    if (token) {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    localStorage.removeItem("token");
    if (logout) logout();
    router.push("/"); 
  }
};

  const showSuccessToast = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="dashboard-container min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={36} />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen">
      <DashNav />

      <main className="dashboard-main-content">
        <div className="w-full max-w-2xl mx-auto">
          <div className="card w-full relative">
            
            {isSaved && (
              <div className="absolute top-4 right-4 bg-pink-100 text-pink-950 border border-pink-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                <Check size={14} className="text-pink-700" /> Changes saved successfully!
              </div>
            )}

            <div className="flex items-center justify-between mb-6 border-b border-pink-100/50 pb-4">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                  <User className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={28} />
                  <span>Profile Settings</span>
                </h2>
                <p className="text-sm text-pink-900/60 mt-1">
                  Manage your account information and preferences.
                </p>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-100 hover:bg-pink-200 border border-pink-300 text-pink-950 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="Logout"
              >
                {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                <span>Logout</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-pink-100 border border-pink-300 text-pink-950 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-pink-100/80 flex items-center justify-center">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.username || "Profile"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-12 h-12 text-pink-400" />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 bg-pink-100 hover:bg-pink-200 border border-pink-300 text-pink-950 rounded-full shadow-md cursor-pointer transition-all duration-200 active:scale-95 group-hover:scale-105"
                  title="Upload photo"
                >
                  <Camera size={16} className="text-pink-800" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={saving}
                  />
                </label>
              </div>
              <h3 className="mt-3 text-lg font-bold text-pink-950">{profile.name || "N/A"}</h3>
              <span className="text-xs text-pink-900/60 font-medium">@{profile.username}</span>
            </div>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5 p-3.5 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-pink-900/70 flex items-center gap-1.5">
                    <User size={14} /> Full Name
                  </label>
                  {editingField !== "name" && (
                    <button
                      onClick={() => handleEdit("name", profile.name)}
                      className="p-1 text-pink-900/60 hover:text-pink-950 hover:bg-pink-100/60 rounded-lg transition-all"
                      title="Edit name"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {editingField === "name" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white/80 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-gray-800"
                    />
                    <button
                      onClick={() => handleSave("name")}
                      disabled={saving}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-950 border border-pink-300 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check size={14} className="text-pink-800" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl transition-all active:scale-95"
                    >
                      <X size={14} className="text-purple-800" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-800 px-1">{profile.name || "—"}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-pink-900/70 flex items-center gap-1.5">
                    <Mail size={14} /> Email Address
                  </label>
                  {editingField !== "email" && (
                    <button
                      onClick={() => handleEdit("email", profile.email)}
                      className="p-1 text-pink-900/60 hover:text-pink-950 hover:bg-pink-100/60 rounded-lg transition-all"
                      title="Edit email"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {editingField === "email" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white/80 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-gray-800"
                    />
                    <button
                      onClick={() => handleSave("email")}
                      disabled={saving}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-950 border border-pink-300 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check size={14} className="text-pink-800" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl transition-all active:scale-95"
                    >
                      <X size={14} className="text-purple-800" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-800 px-1">{profile.email || "—"}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-pink-900/70 flex items-center gap-1.5">
                    <Phone size={14} /> Phone Number
                  </label>
                  {editingField !== "phone" && (
                    <button
                      onClick={() => handleEdit("phone", profile.phone)}
                      className="p-1 text-pink-900/60 hover:text-pink-950 hover:bg-pink-100/60 rounded-lg transition-all"
                      title="Edit phone"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {editingField === "phone" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white/80 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-gray-800"
                    />
                    <button
                      onClick={() => handleSave("phone")}
                      disabled={saving}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-950 border border-pink-300 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check size={14} className="text-pink-800" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl transition-all active:scale-95"
                    >
                      <X size={14} className="text-purple-800" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-800 px-1">{profile.phone || "—"}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-pink-900/70 flex items-center gap-1.5">
                    <MapPin size={14} /> City
                  </label>
                  {editingField !== "city" && (
                    <button
                      onClick={() => handleEdit("city", profile.cityId)}
                      className="p-1 text-pink-900/60 hover:text-pink-950 hover:bg-pink-100/60 rounded-lg transition-all"
                      title="Edit city"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {editingField === "city" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white/80 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-gray-800"
                    >
                      <option value="">Select a City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSave("city")}
                      disabled={saving}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-950 border border-pink-300 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check size={14} className="text-pink-800" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl transition-all active:scale-95"
                    >
                      <X size={14} className="text-purple-800" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-800 px-1">{profile.cityName || "—"}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-gray-100/40 border border-gray-200/60 rounded-2xl opacity-75">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                    <AtSign size={14} /> Username
                  </label>
                  <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                    <Lock size={12} /> Read-only
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-600 px-1">{profile.username}</p>
              </div>

              <div className="flex flex-col gap-1.5 p-3.5 bg-gray-100/40 border border-gray-200/60 rounded-2xl opacity-75">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                    <Key size={14} /> Password
                  </label>
                  <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                    <Lock size={12} /> Protected
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-600 px-1">{profile.password}</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}