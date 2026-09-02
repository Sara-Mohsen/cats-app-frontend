"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { User, AtSign, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { registerApi } from "@/lib/api/posts";

interface SignupFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  }); 

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await registerApi(formData);

      if (response.token && response.user) {
        login(response.token, response.user);
      }

      alert("Account created successfully! Welcome 🐾");
      router.push("/");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      alert(error instanceof Error ? error.message : "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

        <div className="p-4 sm:p-4 pb-0 flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="p-8 sm:p-10 pt-1 sm:px-10 sm:pb-10 sm:pt-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-pink-100">
            <Image
              src="/images/logo.png"
              alt="Cats Gallery Logo"
              width={60}
              height={60}
            />
          </div>

          <h2 className="text-2xl font-bold text-pink-900 mb-1">Cats Gallery</h2>
          <p className="text-sm text-pink-600/80 mb-6 text-center font-medium">
            Create an account to join our adorable cat community!
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <User size={19} />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-sm"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <AtSign size={19} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-sm"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <Mail size={19} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-sm"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <Lock size={19} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-11 pr-11 py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-pink-300 hover:text-pink-500 transition"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-linear-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              <span>{loading ? "Creating Account..." : "Sign Up"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}