"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 👈 استيراد Link للتنقل بين الصفحات
import { User, Lock, Eye, EyeOff, ArrowRight, Cat } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
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
    console.log('Logging in with:', formData);
  };

  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all">
        <div className="h-2.5 w-full bg-linear-to-r from-pink-400 via-purple-400 to-pink-500" />
        <div className="p-8 sm:p-10 flex flex-col items-center">
          
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-pink-100">
            <Image
              src="/images/logo.png"
              alt="Cats Library"
              width={60}
              height={60}
            />
          </div>

          <h2 className="text-2xl font-bold text-pink-900 mb-1">Cats Gallery</h2>
          <p className="text-sm text-pink-600/80 mb-8 text-center font-medium">
           Welcome back! Please enter your details to log in and explore our adorable cat collection.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <User size={19} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-pink-200 rounded-xl text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition text-sm"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                <Lock size={19} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
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
              className="w-full mt-2 py-3.5 px-4 bg-linear-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} />
              <span>Log In</span>
            </button>
          </form>

          {/* 👈 النص والرابط الجديد لإنشاء حساب */}
          <p className="mt-4 text-xs text-pink-600 font-medium">
            Don&apos;t have an account?{' '}
            <Link 
              href="/sign" 
              className="font-bold text-purple-400 hover:text-purple-800 underline transition-colors"
            >
              Sign Up
            </Link>
          </p>

          <div className="w-full flex items-center my-6">
            <div className="grow border-t border-pink-100"></div>
            <span className="px-3 text-xs text-pink-400 font-medium">Or</span>
            <div className="grow border-t border-pink-100"></div>
          </div>

          <Link
            href="/"
            className="w-full py-3.5 px-4 bg-white/40 hover:bg-white/60 border border-pink-200/60 text-pink-700 font-semibold rounded-2xl backdrop-blur-sm shadow-sm hover:shadow-md transform active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm text-center"
          >
            <Cat size={17} className="text-pink-400" />
            <span>Explore Cats Without Registration</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
