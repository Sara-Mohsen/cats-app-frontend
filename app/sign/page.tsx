"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { User, AtSign, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft} from "lucide-react";
import Link from "next/link";

interface SignupFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Signing up with:", formData);
  };

  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4">
      {/* Signup Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
        {/* Top Decorative Gradient Bar */}
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />

           {/* Back Button */}
        <div className="p-4 sm:p-4 pb-0 flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-2xl border border-pink-100 transition shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="p-8 sm:p-10 pt-1 sm:px-10 sm:pb-10 sm:pt-1 flex flex-col items-center">
          {/* Logo Container */}
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-pink-100">
            <Image
              src="/images/logo.png"
              alt="Cats Gallery Logo"
              width={60}
              height={60}
            />
          </div>

          {/* Titles */}
          <h2 className="text-2xl font-bold text-pink-900 mb-1">Cats Gallery</h2>
          <p className="text-sm text-pink-600/80 mb-6 text-center font-medium">
            Create an account to join our adorable cat community!
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            {/* 1. Full Name */}
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

            {/* 2. Username (Unique) */}
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

            {/* 3. Email */}
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

            {/* 4. Password */}
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

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 bg-linear-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
